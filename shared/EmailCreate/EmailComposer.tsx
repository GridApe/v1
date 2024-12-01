'use client';

import { useState, ChangeEvent, KeyboardEvent } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { NavigationBar } from './NavigationBar';
import { EmailToolbar } from './EmailToolbar';
import { EmailPreview } from './EmailPreview';
import { RecipientList } from './RecipientList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmailComposerProps {
  userEmail?: string;
  userAvatar?: string;
  userName?: string;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  userEmail = 'lyndaada80@gmail.com',
  userAvatar = 'https://github.com/shadcn.png',
  userName = 'Lynda Ada',
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [emailContent, setEmailContent] = useState<string>('');
  const [subject, setSubject] = useState<string>('Design Proposal');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState<string>('');

  const handleAddRecipient = () => {
    if (newRecipient && /\S+@\S+\.\S+/.test(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
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
                  <Select defaultValue="default">
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback>
                              {userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          {userEmail}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={userAvatar} alt={userName} />
                            <AvatarFallback>
                              {userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          {userEmail}
                        </div>
                      </SelectItem>
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
                        <Input
                          id="to"
                          value={newRecipient}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setNewRecipient(e.target.value)
                          }
                          placeholder="Enter recipient email"
                          className="flex-1"
                          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddRecipient();
                            }
                          }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleAddRecipient}
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

                {/* Content field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <Label>Content</Label>
                    <EmailToolbar />
                  </div>
                  <Textarea
                    className="min-h-[300px] p-4"
                    placeholder="Write your email content here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
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
                <EmailPreview
                  userName={userName}
                  userEmail={userEmail}
                  userAvatar={userAvatar}
                  recipients={recipients}
                  subject={subject}
                  emailContent={emailContent}
                />
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmailComposer;
