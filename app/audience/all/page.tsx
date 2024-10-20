"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Rocket from "@/shared/Rocket";

interface Contact {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  subscription: string;
  group: string;
  contactDate: string;
}

const mockContacts: Contact[] = [
  {
    fullName: "Emma Queen",
    emailAddress: "emmaqueen@gmail.com",
    phoneNumber: "+234810987654",
    subscription: "Subscribed",
    group: "Group A",
    contactDate: "Aug 12, 2024 5:30pm",
  },
  {
    fullName: "Ade Adam",
    emailAddress: "adaadam34@yahoo.com",
    phoneNumber: "+23480345678",
    subscription: "subscribed",
    group: "Group A",
    contactDate: "July 23, 2024 1:00pm",
  },
  {
    fullName: "Uche Eucharia",
    emailAddress: "euchariauc@gmail.com",
    phoneNumber: "+234703456657",
    subscription: "Unsubscribed",
    group: "Group B",
    contactDate: "Feb 2, 2024 6:03am",
  },
];

export default function AudiencePage() {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [activeTab, setActiveTab] = useState("all-contacts");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
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
          <div className="flex justify-between items-center mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all-contacts">All Contact</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search document, template,..."
                className="max-w-sm"
              />
              <Button variant="outline">Import</Button>
              <Button>Add contact</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Input type="checkbox" />
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
              {contacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input type="checkbox" />
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
        </>
      ) : (
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl p-8 mx-auto">
            <Rocket  />
            <h2 className="text-[#0D0F56] text-3xl font-semibold mb-4">
              Grow your Audience
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Here is where you will add and manage your contacts. Once your
              first contact is added, you will be able to send your first
              campaign.
            </p>
            <Button size="lg" className="bg-[#2E3192]">
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
    </motion.div>
  );
}