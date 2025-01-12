'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NavigationBar } from './NavigationBar';
import { EmailPreview } from './EmailPreview';
import { RecipientList } from './RecipientList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TemplateTypes } from '@/types/interface';

interface Contact {
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

interface SenderEmail {
  email: string;
  is_default: boolean;
  name: string | null;
}

// interface EmailComposerProps {
//   userAvatar?: string;
//   userName?: string;
// }

const EmailComposer: React.FC = () => {
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
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/user/audience/all');
      const result = await response.json();
      if (result.status === 'success' && result.data && Array.isArray(result.data.contacts)) {
        setContacts(result.data.contacts);
      } else {
        console.error('Unexpected API response structure:', result);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/user/templates/all');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
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
      if (result.status === 'success' && result.data && Array.isArray(result.data.emails)) {
        setSenderEmails(result.data.emails);
        const defaultEmail = result.data.emails.find((email: SenderEmail) => email.is_default);
        if (defaultEmail) {
          setSelectedSenderEmail(defaultEmail.email);
        }
      } else {
        console.error('Unexpected API response structure:', result);
      }
    } catch (error) {
      console.error('Error fetching sender emails:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl">
      <NavigationBar showPreview={showPreview} setShowPreview={setShowPreview} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,500px]">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#1E0E4E]">New Email</h1>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
              <div className="space-y-4">
                {/* From field */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Label htmlFor="from" className="w-20">
                    From:
                  </Label>
                  <Select
                    value={selectedSenderEmail}
                    onValueChange={(value) => setSelectedSenderEmail(value)}
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png" alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          {senderEmails.find(email => email.email === selectedSenderEmail)?.email || selectedSenderEmail}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {senderEmails.map((email) => (
                        <SelectItem key={email.email} value={email.email}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png" alt="User Avatar" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            {email.email || email.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* To field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Label htmlFor="to" className="w-20">
                      To:
                    </Label>
                    <div className="flex flex-1 items-center gap-2 flex-wrap">
                      <div className="flex-1">
                        <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                          <PopoverTrigger asChild>
                            <Input
                              id="to"
                              value={newRecipient}
                              onChange={handleInputChange}
                              placeholder="Enter recipient email or name"
                              className="flex-1"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <div className="p-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="all"
                                  checked={filteredContacts.every((contact) =>
                                    recipients.includes(contact.email)
                                  )}
                                  onCheckedChange={toggleAllContacts}
                                />
                                <label
                                  htmlFor="all"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Select All
                                </label>
                              </div>
                            </div>
                            <ul className="max-h-[200px] overflow-auto">
                              {filteredContacts.map((contact) => (
                                <li
                                  key={contact.id}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-100"
                                >
                                  <Checkbox
                                    id={`contact-${contact.id}`}
                                    checked={recipients.includes(contact.email)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleAddRecipient(contact.email);
                                      } else {
                                        removeRecipient(contact.email);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`contact-${contact.id}`}
                                    className="flex-1 text-sm"
                                  >
                                    {`${contact.first_name} ${contact.last_name}`} ({contact.email})
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleAddRecipient(newRecipient)}
                        className="whitespace-nowrap"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  {recipients.length > 0 && (
                    <RecipientList recipients={recipients} onRemove={removeRecipient} />
                  )}
                </div>

                {/* Subject field */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Label htmlFor="subject" className="w-20">
                    Subject:
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {/* Template field */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Label htmlFor="template" className="w-20">
                    Template:
                  </Label>
                  <div className="flex-1">
                    <Popover open={isTemplateDropdownOpen} onOpenChange={setIsTemplateDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          {selectedTemplate ? selectedTemplate.name : "Select a template"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <ul className="max-h-[200px] overflow-auto">
                          {templates.map((template) => (
                            <li
                              key={template.id}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleTemplateSelect(template.id);
                                setIsTemplateDropdownOpen(false);
                              }}
                            >
                              <span className="flex-1 text-sm">{template.name}</span>
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {showPreview && (
            <motion.div
              className="lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-32">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Email Preview</h2>
                  </div>
                  <div className="p-4">
                    <EmailPreview
                      userName={senderEmails.find(email => email.email === selectedSenderEmail)?.name || selectedSenderEmail}
                      userEmail={selectedSenderEmail}
                      userAvatar="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                      recipients={recipients}
                      subject={subject}
                      emailContent={selectedTemplate}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmailComposer;

