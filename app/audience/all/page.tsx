"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus } from "lucide-react";
import Rocket from "@/shared/Rocket";

interface Contact {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  subscription: string;
  group: string;
  contactDate: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    fullName: "Emma Queen",
    emailAddress: "emmaqueen@gmail.com",
    phoneNumber: "+234810987654",
    subscription: "Subscribed",
    group: "Group A",
    contactDate: "Aug 12, 2024 5:30pm",
  },
  {
    id: "2",
    fullName: "Ade Adam",
    emailAddress: "adaadam34@yahoo.com",
    phoneNumber: "+23480345678",
    subscription: "Subscribed",
    group: "Group A",
    contactDate: "July 23, 2024 1:00pm",
  },
  {
    id: "3",
    fullName: "Uche Eucharia",
    emailAddress: "euchariauc@gmail.com",
    phoneNumber: "+234703456657",
    subscription: "Unsubscribed",
    group: "Group B",
    contactDate: "Feb 2, 2024 6:03am",
  },
];

export default function AudiencePage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [activeTab, setActiveTab] = useState("all-contacts");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'contactDate'>>({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    subscription: "Subscribed",
    group: "",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const filteredContacts = contacts.filter(contact =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm)
  );

  const handleAddContact = () => {
    const currentDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const newContactWithId: Contact = {
      ...newContact,
      id: (contacts.length + 1).toString(),
      contactDate: currentDate
    };
    setContacts([...contacts, newContactWithId]);
    setNewContact({
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      subscription: "Subscribed",
      group: "",
    });
    setIsAddContactOpen(false);
  };

  return (
    <motion.div
      className="p-6 mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-2xl font-bold mb-6">Contact</h1>
      
      {contacts.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 md:mb-0">
              <TabsList>
                <TabsTrigger value="all-contacts">All Contact</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Import</Button>
              <Button onClick={() => setIsAddContactOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add contact
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Contact date created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{contact.fullName}</TableCell>
                    <TableCell>{contact.emailAddress}</TableCell>
                    <TableCell>{contact.phoneNumber}</TableCell>
                    <TableCell>{contact.subscription}</TableCell>
                    <TableCell>{contact.group}</TableCell>
                    <TableCell>{contact.contactDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl p-8 mx-auto">
            <Rocket />
            <h2 className="text-[#0D0F56] text-3xl font-semibold mb-4">
              Grow your Audience
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Here is where you will add and manage your contacts. Once your
              first contact is added, you will be able to send your first
              campaign.
            </p>
            <Button size="lg" className="bg-[#2E3192]" onClick={() => setIsAddContactOpen(true)}>
              Add Contact
            </Button>
          </div>

          <div className="text-left">
            <h3 className="text-[#0D0F56] text-xl font-semibold mb-2">
              No contacts added yet
            </h3>
            <p className="text-gray-600">
              Start engaging your audience by sharing your passion and interest to
              grow contacts faster.
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isAddContactOpen && (
          <Sheet open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <SheetContent className="sm:max-w-[400px]">
              <SheetHeader>
                <SheetTitle>Create Contact</SheetTitle>
                <SheetDescription>
                  Add a new contact to your audience. Click save when you&apos;re done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={newContact.fullName}
                    onChange={(e) => setNewContact({...newContact, fullName: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emailAddress" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="emailAddress"
                    value={newContact.emailAddress}
                    onChange={(e) => setNewContact({...newContact, emailAddress: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={newContact.phoneNumber}
                    onChange={(e) => setNewContact({...newContact, phoneNumber: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group" className="text-right">
                    Group
                  </Label>
                  <Select
                    value={newContact.group}
                    onValueChange={(value) => setNewContact({...newContact, group: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Group A">Group A</SelectItem>
                      <SelectItem value="Group B">Group B</SelectItem>
                      <SelectItem value="Group C">Group C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit" onClick={handleAddContact}>Add Contact</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
    </motion.div>
  );
}