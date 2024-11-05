"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Pencil,
  X,
  Trash2,
  MoreHorizontal,
  Check,
  Copy,
  Mail,
  Eye,
  Settings,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface DNSRecord {
  type: string;
  hostname: string;
  value: string;
}

interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  lastModified: Date;
}

export default function EmailDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [emailStats, setEmailStats] = useState<EmailStats>({
    sent: 1250,
    delivered: 1200,
    opened: 850,
    clicked: 425,
  });

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      subject: "Welcome Email",
      content: "Dear {name},\n\nWelcome to our platform...",
      lastModified: new Date(),
    },
  ]);

  const calculateDeliveryRate = useCallback((stats: EmailStats) => {
    return ((stats.delivered / stats.sent) * 100).toFixed(1);
  }, []);

  const calculateOpenRate = useCallback((stats: EmailStats) => {
    return ((stats.opened / stats.delivered) * 100).toFixed(1);
  }, []);

  const renderEmailPreview = (template: EmailTemplate) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="border-b pb-4 mb-4">
          <h3 className="font-semibold">Subject: {template.subject}</h3>
        </div>
        <div className="prose max-w-none">
          {template.content.split("\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    );
  };

  const PerformanceCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {emailStats.sent.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          <Check className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {calculateDeliveryRate(emailStats)}%
          </div>
          <p className="text-xs text-muted-foreground">+2.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
          <Eye className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {calculateOpenRate(emailStats)}%
          </div>
          <p className="text-xs text-muted-foreground">+5.4% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          <Settings className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((emailStats.clicked / emailStats.opened) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">+1.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen  ">
      <main className="container mx-auto px-4 py-6">
        {/* <div className="mb-6">
          <h1 className="text-sm text-muted-foreground">Email Management</h1>
        </div> */}

        <PerformanceCards />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="border-b bg-transparent p-0 h-auto flex justify-start overflow-x-auto">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#1E0E4E] data-[state=active]:bg-transparent whitespace-nowrap"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="domains"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#1E0E4E] data-[state=active]:bg-transparent whitespace-nowrap"
            >
              Domains
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#1E0E4E] data-[state=active]:bg-transparent whitespace-nowrap"
            >
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between">
                <div className="w-full">
                  <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">
                    Basic Information
                  </h2>

                  <div className="mb-6">
                    <Label className="text-sm mb-4 block">Profile Photo</Label>
                    <div className="flex items-end gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <img
                            src="https://github.com/shadcn.png"
                            alt="Profile"
                          />
                        </Avatar>
                        <Button
                          size="icon"
                          className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-[#1E0E4E]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-xl">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="deutsch">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deutsch">Deutsch</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="espanol">Español</SelectItem>
                          <SelectItem value="francais">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">
                    Change password
                  </h2>
                  <div className="space-y-4 max-w-xl">
                    <div>
                      <Label htmlFor="currentPassword">
                        Verify current password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="domains">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-semibold text-[#1E0E4E] mb-2">
                  Sending email
                </h2>
                <p className="text-muted-foreground mb-6">
                  Add a verified email domain to control how your emails will be
                  send to your customer. Start sending campaigns once you verify
                  your domain ownership, start connecting with your customers
                  through gridape.
                </p>
                <Button
                  onClick={() => setShowVerifyModal(true)}
                  className="bg-[#1E0E4E] hover:bg-[#1E0E4E]/90"
                >
                  Verify Domain
                </Button>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">
                  Existing domain
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Domain Address</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Emsa
                        </div>
                      </TableCell>
                      <TableCell>emsang.com</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="templates">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {emailTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {template.subject}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Last modified:{" "}
                        {template.lastModified.toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.content}
                      </p>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentTemplate(template);
                            setShowPreviewModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#1E0E4E] hover:bg-[#1E0E4E]/90"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              <DialogDescription>
                Preview how your email will appear to recipients
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {currentTemplate && renderEmailPreview(currentTemplate)}
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Verify a domain</DialogTitle>
              <DialogDescription>
                Please enter an email address with the domain you want to
                verify. A confirmation link will be sent to you.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="verifyEmail">Email address</Label>
                <Input id="verifyEmail" type="email" />
              </div>
              <div className="text-sm">
                Already have a domain?{" "}
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Connect here
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setShowVerifyModal(false)}>
                Cancel
              </Button>
              <Button className="bg-[#1E0E4E] hover:bg-[#1E0E4E]/90">
                Send email
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
