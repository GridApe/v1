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
  ChevronDown,
  Plus,
  ArrowUp,
  ArrowUp01,
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

interface DNSRecord {
  type: string;
  hostname: string;
  value: string;
}

interface DomainVerificationSteps {
  title: string;
  description: string;
  records: DNSRecord[];
}

interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

interface Domain {
  id: string;
  brandName: string;
  domainAddress: string;
  isVerified: boolean;
}

export default function EmailDashboard() {
  const [activeTab, setActiveTab] = useState("domains");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [showDNSSteps, setShowDNSSteps] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [newDomain, setNewDomain] = useState({
    brandName: "",
    domainAddress: "",
  });
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "1",
      brandName: "Emsa",
      domainAddress: "emsang.com",
      isVerified: true,
    },
  ]);

  const [emailStats] = useState<EmailStats>({
    sent: 3189,
    delivered: 3100,
    opened: 2109,
    clicked: 1500,
  });

  const dnsSteps: DomainVerificationSteps[] = [
    {
      title: "Go to your DNS Provider",
      description:
        "Go to DNS provider that you use to manage emsang.com and the following DNS records.",
      records: [],
    },
    {
      title: "Add DNS Records for sending",
      description:
        "TXT records are required to send and receive email with Gridape.",
      records: [
        {
          type: "TXT",
          hostname: "emsang.com",
          value: "Lorem ipsum dolor sit amet et amet",
        },
        {
          type: "TXT",
          hostname: "gridape.domainkeyemsang.com",
          value:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor",
        },
      ],
    },
    {
      title: "Add DNS Records for tracking",
      description:
        "TXT records are required to send and receive email with Gridape.",
      records: [
        {
          type: "CNAME",
          hostname: "email.emsang.com",
          value: "gridape.org",
        },
      ],
    },
  ];

  const handleCopyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy value:", err);
    }
  };

  const handleVerifyDomain = (e: React.FormEvent) => {
    e.preventDefault();
    setShowVerifyModal(false);
    setShowDNSSteps(true);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const newDomainEntry: Domain = {
      id: (domains.length + 1).toString(),
      ...newDomain,
      isVerified: false,
    };
    setDomains([...domains, newDomainEntry]);
    setNewDomain({ brandName: "", domainAddress: "" });
    setShowAddDomainModal(false);
    setShowVerifyModal(true);
  };

  const PerformanceCard = ({
    title,
    value,
    icon,
    percentage,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    percentage: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500 inline-block"><ArrowUp /></span> {percentage}%
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-sm text-muted-foreground">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <PerformanceCard
            title="Emails Sent"
            value={emailStats.sent}
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            percentage={100}
          />
          <PerformanceCard
            title="Delivered"
            value={emailStats.delivered}
            icon={<Check className="h-4 w-4 text-green-500" />}
            percentage={97}
          />
          <PerformanceCard
            title="Opened"
            value={emailStats.opened}
            icon={<Eye className="h-4 w-4 text-blue-500" />}
            percentage={68}
          />
          <PerformanceCard
            title="Clicked"
            value={emailStats.clicked}
            icon={<Settings className="h-4 w-4 text-purple-500" />}
            percentage={71}
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="border-b bg-transparent p-0 flex justify-start h-auto">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#1E0E4E] data-[state=active]:bg-transparent"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="domains"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#1E0E4E] data-[state=active]:bg-transparent"
            >
              Domains
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
              {showDNSSteps ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1E0E4E] mb-4">
                      Now follow these steps to verify your domain
                    </h2>
                  </div>

                  {dnsSteps.map((step, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#1E0E4E]">
                        {index + 1}. {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>

                      {step.records.length > 0 && (
                        <div className="bg-white rounded-lg border p-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Hostname</TableHead>
                                <TableHead>Enter this value</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {step.records.map((record, recordIndex) => (
                                <TableRow key={recordIndex}>
                                  <TableCell className="font-mono">
                                    {record.type}
                                  </TableCell>
                                  <TableCell className="font-mono">
                                    {record.hostname}
                                  </TableCell>
                                  <TableCell className="font-mono max-w-md truncate">
                                    {record.value}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleCopyValue(record.value)
                                      }
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-[#1E0E4E] mb-2">
                      Sending email
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Add a verified email domain to control how your emails
                      will be send to your customer. Start sending campaigns
                      once you verify your domain ownership, start connecting
                      with your customers through gridape.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setShowAddDomainModal(true)}
                        className="bg-[#1E0E4E] hover:bg-[#1E0E4E]/90"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Domain
                      </Button>
                      <Button
                        onClick={() => setShowVerifyModal(true)}
                        variant="outline"
                      >
                        Verify Domain
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-[#1E0E4E] mb-6">
                      Existing domains
                    </h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Brand Name</TableHead>
                          <TableHead>Domain Address</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {domains.map((domain) => (
                          <TableRow key={domain.id}>
                            <TableCell className="font-medium">
                              {domain.brandName}
                            </TableCell>
                            <TableCell>{domain.domainAddress}</TableCell>
                            <TableCell>
                              {domain.isVerified ? (
                                <span className="flex items-center text-green-500">
                                  <Check className="mr-2 h-4 w-4" /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center text-yellow-500">
                                  <AlertCircle className="mr-2 h-4 w-4" />{" "}
                                  Pending
                                </span>
                              )}
                            </TableCell>
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Verify a domain</DialogTitle>
              <DialogDescription>
                Please enter an email address with the domain you want to
                verify. A confirmation link will be sent to you.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyDomain} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="verifyEmail">Email address</Label>
                <Input
                  id="verifyEmail"
                  type="email"
                  value={verificationEmail}
                  onChange={(e) => setVerificationEmail(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm">
                Already have a domain?{" "}
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Connect here
                </Button>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowVerifyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1E0E4E] hover:bg-[#1E0E4E]/90"
                >
                  Send email
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddDomainModal} onOpenChange={setShowAddDomainModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add a new domain</DialogTitle>
              <DialogDescription>
                Enter the details of the new domain you want to add.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDomain} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={newDomain.brandName}
                  onChange={(e) =>
                    setNewDomain({ ...newDomain, brandName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domainAddress">Domain Address</Label>
                <Input
                  id="domainAddress"
                  value={newDomain.domainAddress}
                  onChange={(e) =>
                    setNewDomain({
                      ...newDomain,
                      domainAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddDomainModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1E0E4E] hover:bg-[#1E0E4E]/90"
                >
                  Add Domain
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
