"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Search,
  ChevronDown,
  Eye,
  EyeOff,
  Users,
  Mail,
  AlertCircle,
  Copy,
  ImagePlus,
  Link,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface EmailComposerProps {
  userEmail?: string;
  userAvatar?: string;
  userName?: string;
}

export default function EmailComposer({
  userEmail = "lyndaada80@gmail.com",
  userAvatar = "/placeholder.svg",
  userName = "Lynda Ada",
}: EmailComposerProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [emailContent, setEmailContent] = useState("");
  const [subject, setSubject] = useState("Design Proposal");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");

  const handleAddRecipient = () => {
    if (newRecipient && /\S+@\S+\.\S+/.test(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl">
      

      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold text-[#1E0E4E]">
                Create email
              </span>
            </motion.div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="sm:flex hidden"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
                            <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
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
                            <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          {userEmail}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                          onChange={(e) => setNewRecipient(e.target.value)}
                          placeholder="Enter recipient email"
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
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
                    <div className="ml-24 flex flex-wrap gap-2">
                      {recipients.map((email) => (
                        <div
                          key={email}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                        >
                          <span>{email}</span>
                          <button
                            onClick={() => removeRecipient(email)}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <Label htmlFor="subject" className="w-20">
                    Subject:
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <Label>Content</Label>
                    <div className="flex gap-2 flex-wrap">
                      <div className="flex items-center rounded-lg border bg-white shadow-sm p-1">
                        <TooltipProvider>
                          {[
                            { icon: Type, label: "Font" },
                            { icon: Bold, label: "Bold" },
                            { icon: Italic, label: "Italic" },
                            { icon: Underline, label: "Underline" },
                            { icon: List, label: "Bullet List" },
                            { icon: ListOrdered, label: "Numbered List" },
                            { icon: AlignLeft, label: "Align Left" },
                            { icon: AlignCenter, label: "Align Center" },
                            { icon: AlignRight, label: "Align Right" },
                          ].map((tool) => (
                            <Tooltip key={tool.label}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <tool.icon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{tool.label}</TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center rounded-lg border bg-white shadow-sm p-1">
                        <TooltipProvider>
                          {[
                            { icon: ImagePlus, label: "Add Image" },
                            { icon: Link, label: "Add Link" },
                          ].map((tool) => (
                            <Tooltip key={tool.label}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <tool.icon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{tool.label}</TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
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
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="space-y-6">
                    <h2 className="font-semibold text-gray-900">Email Preview</h2>
                    
                    <div className="space-y-2 border-b pb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar} alt={userName} />
                          <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{userName}</div>
                          <div className="text-sm text-gray-500">{userEmail}</div>
                        </div>
                      </div>
                      {recipients.length > 0 && (
                        <div className="text-sm text-gray-600">
                          To: {recipients.join(", ")}
                        </div>
                      )}
                      <div className="font-medium">{subject}</div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      {emailContent || (
                        <div className="text-gray-400 italic">
                          Your email content will appear here as you type...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}