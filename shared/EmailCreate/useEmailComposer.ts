import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ContactTypes, TemplateTypes } from '@/types/interface';
import { useCampaignStore } from '@/store/useCampaignStore';

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
  const [newRecipient, setNewRecipient] = useState<string>('');
  const [contacts, setContacts] = useState<ContactTypes[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactTypes[]>([]);
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
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/user/audience/all');
      const result = await response.json();
      if (result.status === 'success' && result.data && Array.isArray(result.data.contacts)) {
        setContacts(result.data.contacts);
      }
      console.log('Contacts:', result.data.contacts);
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/user/templates/all');
      const result = await response.json();
      if (result.status === 'success') {
        setTemplates(result.data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
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

  useEffect(() => {
    setFilteredContacts(
      contacts.filter(
        (contact) =>
          contact.email.toLowerCase().includes(newRecipient.toLowerCase()) ||
          `${contact.first_name} ${contact.last_name}`
            .toLowerCase()
            .includes(newRecipient.toLowerCase())
      )
    );
  }, [newRecipient, contacts]);

  const toggleAllContacts = (checked: boolean) => {
    const { recipients, setRecipients } = useCampaignStore.getState();
    
    if (checked) {
      // If there's a search filter, only toggle filtered contacts
      const contactsToAdd = newRecipient
        ? filteredContacts.map(contact => contact.email)
        : contacts.map(contact => contact.email);
      
      // Combine existing recipients with new ones, removing duplicates
      const newRecipients = Array.from(new Set([...recipients, ...contactsToAdd]));
      setRecipients(newRecipients);
    } else {
      // If there's a search filter, only remove filtered contacts
      const emailsToRemove = newRecipient
        ? new Set(filteredContacts.map(contact => contact.email))
        : new Set(contacts.map(contact => contact.email));
      
      setRecipients(recipients.filter((email: any) => !emailsToRemove.has(email)));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewRecipient(e.target.value);
    setIsDropdownOpen(true);
  };

  return {
    showPreview,
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
    setNewRecipient,
    handleInputChange,
    toggleAllContacts,
    setIsDropdownOpen,
    setIsTemplateDropdownOpen,
    setSelectedSenderEmail,
  };
};