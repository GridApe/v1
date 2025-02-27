'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Users, Calendar, Delete } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { useEmailComposer } from './useEmailComposer';
import { ChangeEvent } from 'react';
import { useCampaignStore } from '@/store/useCampaignStore';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Switch } from '@/components/ui/switch';
import { RecipientList } from './RecipientList';

const EmailComposer: React.FC = () => {
  const router = useRouter();
  const {
    showPreview,
    newRecipient,
    filteredContacts,
    isDropdownOpen,
    templates,
    senderEmails,
    selectedSenderEmailId,
    setShowPreview,
    setNewRecipient,
    handleInputChange,
    toggleAllContacts,
    setIsDropdownOpen,
    setSelectedSenderEmailId,
  } = useEmailComposer();

  const {
    subject,
    recipients,
    selectedTemplateId,
    selectedTemplateState,
    isScheduled,
    scheduledDateTime,
    setSubject,
    setRecipients,
    setSelectedTemplateId,
    setSelectedTemplateState,
    setAction,
    setIsScheduled,
    setScheduledDateTime,
  } = useCampaignStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddRecipient = (email: string) => {
    if (
      email &&
      !recipients.includes(email) &&
      filteredContacts.some((contact) => contact.email === email)
    ) {
      setRecipients([...recipients, email]);
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleTemplateAction = (
    action: 'select_template' | 'edit_template' | 'change_template'
  ) => {
    setAction(action);
    localStorage.setItem('comingFrom', 'create_campaign');

    if (action === 'select_template' || action === 'change_template') {
      router.push('/dashboard/templates/saved');
    } else if (action === 'edit_template' && selectedTemplateId) {
      router.push(`/dashboard/templates/edit/${selectedTemplateId}`);
    }
  };

  const [selectedGroup, setSelectedGroup] = useState('');

  // filter groups from contact list

  const groups = filteredContacts.reduce(
    (acc: { id: string; name: string; members: string[] }[], contact) => {
      contact.groups.forEach((group: any) => {
        const existingGroup = acc.find((g) => g.id === group.id);
        if (existingGroup) {
          existingGroup.members.push(contact.email);
        } else {
          acc.push({ id: group.id, name: group.name, members: [contact.email] });
        }
      });
      return acc;
    },
    []
  );

  // handles selction of groug
  const handleGroupSelection = (groupId: string) => {
    setSelectedGroup(groupId);
    const selectedGroup = groups.find((group) => group.id === groupId);
    setRecipients(selectedGroup?.members || []);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  // Attach click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl">
      <NavigationBar
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        selectedSenderEmailId={selectedSenderEmailId}
      />

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
                    value={selectedSenderEmailId}
                    onValueChange={(value) => setSelectedSenderEmailId(value)}
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                              alt="User Avatar"
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          {senderEmails.find((email) => email.id === selectedSenderEmailId)
                            ?.email || 'Select sender'}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {senderEmails.map((email) => (
                        <SelectItem key={email.id} value={email.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                                alt="User Avatar"
                              />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            {email.email}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* group selection field */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Label htmlFor="group" className="w-20">
                    Group:
                  </Label>
                  <Select value={selectedGroup} onValueChange={handleGroupSelection}>
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue>
                        {groups.find((g) => g.id === selectedGroup)?.name || 'Select a group'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
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
                      <div className="flex-1 relative" ref={dropdownRef}>
                        <Input
                          id="to"
                          value={newRecipient}
                          onChange={handleInputChange}
                          onFocus={() => setIsDropdownOpen(true)}
                          placeholder="Enter recipient email or name"
                          className="flex-1"
                        />
                        {/* Custom Dropdown */}
                        {isDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
                            <div className="p-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="all"
                                  checked={
                                    filteredContacts.length > 0 &&
                                    filteredContacts.every((contact) =>
                                      recipients.includes(contact.email)
                                    )
                                  }
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
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    if (recipients.includes(contact.email)) {
                                      removeRecipient(contact.email);
                                    } else {
                                      handleAddRecipient(contact.email);
                                    }
                                  }}
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
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => {
                          if (newRecipient) {
                            handleAddRecipient(newRecipient);
                          } else if (recipients.length > 0) {
                            setRecipients([]);
                          }
                        }}
                        className="whitespace-nowrap add-btn"
                      >
                        {newRecipient ? (
                          <>
                            Add
                            {!filteredContacts.some(
                              (contact) => contact.email === newRecipient
                            ) && <span className="text-red-500 ml-1">Not found</span>}
                          </>
                        ) : recipients.length > 0 ? (
                          <>
                            Clear All
                            <Users className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Add
                            <Users className="h-4 w-4 ml-2" />
                          </>
                        )}
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
                    Content:
                  </Label>
                  <div className="flex-1 flex items-center justify-end gap-4">
                    {selectedTemplateState === 'selected' ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => handleTemplateAction('edit_template')}
                        >
                          Edit Content
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleTemplateAction('change_template')}
                        >
                          Change Template
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => handleTemplateAction('select_template')}
                      >
                        Select Template
                      </Button>
                    )}
                  </div>
                </div>

                {/* Schedule field */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Label htmlFor="schedule" className="w-20">
                    Schedule:
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="send-now"
                        checked={!isScheduled}
                        onCheckedChange={(checked) => setIsScheduled(!checked)}
                      />
                      <Label htmlFor="send-now">Send Now</Label>
                    </div>
                    {isScheduled && (
                      <DatePicker
                        selected={scheduledDateTime}
                        onChange={(date: Date | null) => setScheduledDateTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        customInput={
                          <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            {scheduledDateTime
                              ? scheduledDateTime.toLocaleString()
                              : 'Pick a date and time'}
                          </Button>
                        }
                      />
                    )}
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
                      userName={
                        senderEmails.find((email) => email.id === selectedSenderEmailId)?.name ||
                        'Sender'
                      }
                      userEmail={
                        senderEmails.find((email) => email.id === selectedSenderEmailId)?.email ||
                        ''
                      }
                      userAvatar="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                      recipients={recipients}
                      subject={subject}
                      emailContent={templates.find((t) => t.id === selectedTemplateId) || null}
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
