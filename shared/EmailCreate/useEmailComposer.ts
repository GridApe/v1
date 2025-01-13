import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateTypes } from '@/types/interface';


export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
}

export interface SenderEmail {
  email: string;
  is_default: boolean;
  name: string | null;
}



interface EmailComposerState {
  subject: string;
  recipients: string[];
  selectedSenderEmail: string;
}

export const useEmailComposer = () => {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [subject, setSubject] = useState<string>('Sample Subject');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [templates, setTemplates] = useState<TemplateTypes[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateTypes | null>(null);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState<boolean>(false);
  const [senderEmails, setSenderEmails] = useState<SenderEmail[]>([]);
  const [selectedSenderEmail, setSelectedSenderEmail] = useState<string>('');

  useEffect(() => {
    fetchContacts();
    fetchTemplates();
    fetchSenderEmails();
    restoreState();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/user/audience/all');
      const result = await response.json();
      if (result.status === 'success' && result.data && Array.isArray(result.data.contacts)) {
        setContacts(result.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/user/templates/all');
      const responseData = await response.json();
      setTemplates(responseData.data.templates || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchSenderEmails = async () => {
    try {
      const response = await fetch('/api/user/domains/sending-emails');
      const result = await response.json();
      if (result.status === 'success' && result.data?.emails) {
        setSenderEmails(result.data.emails);
        const defaultEmail = result.data.emails.find((email: SenderEmail) => email.is_default);
        if (defaultEmail) {
          setSelectedSenderEmail(defaultEmail.email);
        }
      }
    } catch (error) {
      console.error('Error fetching sender emails:', error);
    }
  };

  const saveState = () => {
    const state: EmailComposerState = {
      subject,
      recipients,
      selectedSenderEmail,
    };
    localStorage.setItem('emailComposerState', JSON.stringify(state));
  };

  const restoreState = () => {
    const savedState = localStorage.getItem('emailComposerState');
    if (savedState) {
      const state: EmailComposerState = JSON.parse(savedState);
      setSubject(state.subject);
      setRecipients(state.recipients);
      setSelectedSenderEmail(state.selectedSenderEmail);
    }
  };

  useEffect(() => {
    setFilteredContacts(
      contacts.filter(
        (contact) =>
          (contact.email.toLowerCase().includes(newRecipient.toLowerCase()) ||
            `${contact.first_name} ${contact.last_name}`
              .toLowerCase()
              .includes(newRecipient.toLowerCase())) &&
          !recipients.includes(contact.email)
      )
    );
  }, [newRecipient, contacts, recipients]);

  const handleAddRecipient = (email: string) => {
    if (!recipients.includes(email)) {
      setRecipients([...recipients, email]);
    }
    setNewRecipient('');
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewRecipient(e.target.value);
    setIsDropdownOpen(true);
  };

  const toggleAllContacts = (checked: boolean) => {
    if (checked) {
      const newRecipients = recipients.slice();
      filteredContacts.forEach(contact => {
        if (!newRecipients.includes(contact.email)) {
          newRecipients.push(contact.email);
        }
      });
      setRecipients(newRecipients);
    } else {
      setRecipients(recipients.filter((r) => !filteredContacts.some((c) => c.email === r)));
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleTemplateAction = () => {
    saveState();
    if (selectedTemplate) {
      router.push(`/dashboard/templates/edit/${selectedTemplate.id}`);
    } else {
      router.push('/dashboard/templates/saved');
    }
  };

  return {
    showPreview,
    subject,
    recipients,
    newRecipient,
    contacts,
    filteredContacts,
    isDropdownOpen,
    templates,
    selectedTemplate,
    isTemplateDropdownOpen,
    senderEmails,
    selectedSenderEmail,
    setShowPreview,
    setSubject,
    handleAddRecipient,
    removeRecipient,
    handleInputChange,
    toggleAllContacts,
    handleTemplateSelect,
    setIsDropdownOpen,
    setIsTemplateDropdownOpen,
    setSelectedSenderEmail,
    handleTemplateAction,
  };
};