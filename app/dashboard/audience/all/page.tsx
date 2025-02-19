'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, FileUp, Users, Filter, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Rocket from '@/shared/Rocket';
import { ContactTypes } from '@/types/interface';
import { toast } from '@/hooks/use-toast';
import { setgroups } from 'process';

const API_BASE_URL = 'https://api.gridape.com/api/v1/user';

export default function AudiencePage() {
  const [groupSuggestions, setGroupSuggestions] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState('all-contacts');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editopen, seteditopen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<
    (Omit<ContactTypes, 'groups'> & { groups: { name: string }[] }) | null
  >(null);

  const [selectedgroups, setselectedgroups] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSingleModalOpen, setDeletesingleOpen] = useState(false);
  const [contactToDelete, setContactTodelete] = useState<ContactTypes | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contacts, setContacts] = useState<
    (Omit<ContactTypes, 'groups'> & { groups: { name: string }[] })[]
  >([]);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const token = Cookies.get('token');

  const [group, setGroup] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredGroups = groupSuggestions.filter((g) =>
    g.toLowerCase().includes(group.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroup(value);
    setIsDropdownOpen(value.length > 0 && filteredGroups.length > 0);
  };

  const handleSelectGroup = (selectedGroup: string) => {
    // setselectedgroups((prevGroups) => [...prevGroups, selectedGroup]);
    setGroup(selectedGroup);
    handleEnter(selectedGroup);
    setIsDropdownOpen(false);
  };

  const handleSelectGroupEdit = (selectedGroup: string) => {
    setContactToEdit((prev) => {
      if (!prev) return prev; // Ensure prev is not null

      // Check if the group already exists
      const groupExists = prev.groups.some((g) => g.name === selectedGroup);

      if (groupExists) return prev; // Avoid duplicates

      return {
        ...prev,
        groups: [...prev.groups, { name: selectedGroup }], // Add new group
      };
    });

    handleEnterEdit(selectedGroup);
    setIsDropdownOpen(false);
  };

  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState<
    Omit<ContactTypes, 'id' | 'contactDate' | 'user_id'> & {
      groups: Omit<ContactTypes['groups'][number], 'name'>[];
    }
  >({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    groups: [], // ✅ groups exist but without `name`
    address: '',
  });

  useEffect(() => {
    fetchContacts();

    if (editopen && !contactToEdit) {
      seteditopen(false);
    }

    if (deleteSingleModalOpen && !contactToDelete) {
      setDeletesingleOpen(false);
    }
  }, [editopen, contactToEdit, contactToDelete, deleteSingleModalOpen]);

  const fetchContacts = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await fetch('/api/user/audience/all');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const result = await response.json();

      // Updated to match the new response structure
      const contactsData = result.data?.contacts || [];
      setContacts(contactsData);

      if (contactsData.length === 0) {
        toast({
          title: 'No Contacts',
          description: 'You currently have no contacts.',
          variant: 'default',
        });
      }
      if (result?.data.contacts) {
        // Extract unique group names
        const allGroups: string[] = result.data.contacts.flatMap((contact: any) =>
          contact.groups.map((g: { name: string }) => g.name)
        );
        const uniqueGroups = Array.from(new Set(allGroups)); // Remove duplicates

        setGroupSuggestions(uniqueGroups);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setFetchError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to fetch contacts: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAddContact = async () => {
    if (newContact.first_name && newContact.last_name && newContact.email) {
      try {
        const response = await axios.post('/api/user/audience/add', newContact, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Close modal or reset state after successful request
        setIsAddContactOpen(false);
        toast({
          title: 'Contact Added',
          description: 'Your new contact has been successfully added.',
          variant: 'default',
        });

        fetchContacts(); // Refresh the contact list

        setNewContact({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          groups: [],
          address: '',
        });
      } catch (error: any) {
        console.error('Error adding contact:', error.response);

        let errorMessage = 'Failed to add contact. Please try again.';

        // Extract detailed error message from API response
        if (error.response?.data) {
          const apiError = error.response.data;

          if (apiError?.message) {
            errorMessage = apiError.message;
          }

          if (apiError?.errors) {
            const errorDetails = Object.entries(apiError.errors)
              .map(([field, messages]) => `${(messages as any[]).join(', ')}`)
              .join(' ');
            errorMessage += ` ${errorDetails}`;
          }
        }

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill all required fields.',
        variant: 'default',
      });
    }
  };

  const handleDeleteContacts = async () => {
    try {
      await Promise.all(
        selectedContacts.map(async (id) => {
          const response = await fetch(`/api/user/audience/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to delete contact with id ${id}`);
          }
        })
      );
      setSelectedContacts([]);
      setIsDeleteModalOpen(false);
      toast({
        title: 'Contacts Deleted',
        description: 'Selected contacts have been successfully removed.',
        variant: 'default',
      });
      fetchContacts();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Unable to delete contacts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/contacts/bulk-upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload contacts');
        }
        toast({
          title: 'Contacts Uploaded',
          description: 'Your contacts have been successfully uploaded.',
          variant: 'default',
        });
        fetchContacts();
      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload contacts. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // open modal for single contact delete
  const openDeleteModal = (contact: ContactTypes) => {
    setDeletesingleOpen(true);
    setContactTodelete(contact);
  };

  // deletes single contact
  const handleSingleContactDelete = async () => {
    try {
      const response = await fetch(`/api/user/audience/delete/${contactToDelete?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete contact with id ${contactToDelete?.id}`);
      }

      setContactTodelete(null);
      setDeletesingleOpen(false);
      toast({
        title: 'Contacts Deleted',
        description: 'Contact have been successfully removed.',
        variant: 'default',
      });
      fetchContacts();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Unable to delete contacts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/export`);
      if (!response.ok) {
        throw new Error('Failed to export contacts');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export contacts. Please try again.',
        variant: 'destructive',
      });
    }
  };
  const handleRetryFetch = () => {
    fetchContacts();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const filteredContacts =
    contacts?.filter(
      (contact) =>
        `${contact.first_name} ${contact.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    ) || [];

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleOpenEdit = (contact: ContactTypes) => {
    setContactToEdit({
      ...contact,
      groups: contact.groups.map((name) => ({ name })), // Convert string[] to { name: string }[]
    });

    seteditopen(true);
  };

  const handleUpdateContact = async () => {
    if (
      contactToEdit &&
      contactToEdit.first_name &&
      contactToEdit.last_name &&
      contactToEdit.email &&
      contactToEdit.groups
    ) {
      const transformContact = (contact: any) => ({
        last_name: contact.last_name,
        first_name: contact.first_name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address || null,
        groups: contact.groups.map((group: { name: string }) => group.name),
        id: contact.id,
      });

      const data = transformContact(contactToEdit);
      try {
        const response = await axios.put(`/api/user/audience/update/${data.id}`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Success handling
        seteditopen(false);
        toast({
          title: 'Contact Updated!',
          description: 'Your contact has been successfully updated!',
          variant: 'default',
        });
        fetchContacts();
        setContactToEdit(null);
      } catch (error: any) {
        console.error('Update Contact Error:', error);

        let errorMessage = 'Failed to update contact. Please try again.';

        if (error.response) {
          // The request was made and the server responded with a status code not in the range of 2xx
          if (error.response.data && error.response.data.errors) {
            errorMessage = Object.entries(error.response.data.errors)
              .map(([field, messages]) => `${(messages as any[]).join(', ')}`)
              .join(' ');
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = 'No response from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = error.message;
        }

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill all required fields.',
        variant: 'default',
      });
    }
  };

  // handles the enter button for adding groups
  const handleEnter = (selectedgroup: string) => {
    if (selectedgroup.trim() && !selectedgroups.includes(selectedgroup.trim())) {
      // const updatedGroups = [...selectedgroups, selectedgroup.trim()];
      setselectedgroups((prevGroups) => [...prevGroups, selectedgroup.trim()]);

      // Update newContact.group correctly
      setNewContact((prev) => ({
        ...prev,
        groups: [...(prev.groups || []), selectedgroup.trim()],
      }));
    }
    setIsDeleteModalOpen(false);
    // setgroups("");
    setFilteredSuggestions([]);
    setGroup('');
  };

  const handleEnterEdit = (group: string) => {
    if (!group.trim()) return; // Prevent empty groups

    setContactToEdit((prev) => {
      if (!prev) return prev; // Ensure prev is not null

      // Ensure groups array exists and check if the group already exists
      const existingGroups = prev.groups || [];
      const isGroupExists = existingGroups.some((g) => g.name === group.trim());

      if (isGroupExists) return prev; // Prevent duplicates

      return {
        ...prev,
        groups: [...existingGroups, { name: group.trim() }], // Push only the group object
      };
    });

    setFilteredSuggestions([]);
    setGroup('');
    setIsDropdownOpen(false);
  };

  const handleRemoveGroup = (item: string) => {
    setselectedgroups(selectedgroups.filter((selected) => selected !== item));
  };

  const handleRemoveGroupEdit = (item: string) => {
    setContactToEdit((prev) => {
      if (!prev) return prev; // Ensure prev is not null

      return {
        ...prev,
        groups: prev.groups.filter((group) => group.name !== item), // Filter out the selected group
      };
    });
  };

  return (
    <motion.div
      className="p-6 mx-auto max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0D0F56]">Audience Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileUp className="mr-2 h-4 w-4" /> Export
          </Button>
          <label htmlFor="bulk-upload">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Bulk Upload
            </Button>
          </label>
          <input
            id="bulk-upload"
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleBulkUpload}
          />
          <Button size="sm" onClick={() => setIsAddContactOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading contacts...</div>
      ) : contacts && contacts.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all-contacts">
                  <Users className="mr-2 h-4 w-4" /> All Contacts
                </TabsTrigger>
                <TabsTrigger value="groups">
                  <Filter className="mr-2 h-4 w-4" /> Groups
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-3 rounded-lg flex justify-between items-center mb-4"
            >
              <span>{selectedContacts.length} contacts selected</span>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
              </Button>
            </motion.div>
          )}

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length}
                      onCheckedChange={() =>
                        setSelectedContacts(
                          selectedContacts.length === filteredContacts.length
                            ? []
                            : filteredContacts.map((c) => c.id)
                        )
                      }
                    />
                  </TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => handleSelectContact(contact.id)}
                      />
                    </TableCell>
                    <TableCell>{`${contact.first_name} ${contact.last_name}`}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <TableCell>
                        {contact.groups.length === 0
                          ? 'Unassigned'
                          : contact.groups.length === 1
                            ? typeof contact.groups[0] === 'object'
                              ? contact.groups[0]?.name || 'Unassigned'
                              : contact.groups[0]
                            : `${typeof contact.groups.at(0) === 'object' ? (contact.groups.at(0)?.name ?? 'Unknown') : contact.groups.at(0)} ... ${
                                typeof contact.groups.at(-1) === 'object'
                                  ? (contact.groups.at(-1)?.name ?? 'Unknown')
                                  : contact.groups.at(-1)
                              }`}
                      </TableCell>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleOpenEdit({
                                ...contact,
                                groups: contact.groups.map((g) => g.name), // Convert to string[]
                              })
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              openDeleteModal({
                                ...contact,
                                groups: contact.groups.map((g) => g.name), // Convert to string[]
                              })
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
          <div className="bg-white rounded-2xl p-8 mx-auto max-w-md shadow-lg">
            <Rocket />
            <h2 className="text-[#0D0F56] text-3xl font-semibold mb-4">Grow your Audience</h2>
            <p className="text-gray-600 mb-6">
              Here is where you will add and manage your contacts. Once your first contact is added,
              you will be able to send your first campaign.
            </p>
            <Button
              size="lg"
              className="bg-[#2E3192] hover:bg-[#1C1E5F]"
              onClick={() => setIsAddContactOpen(true)}
            >
              Add First Contact
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete single contact's confirmation dialog */}
      <Dialog open={deleteSingleModalOpen} onOpenChange={setDeletesingleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletesingleOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSingleContactDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Sheet */}
      <Sheet
        open={isAddContactOpen}
        onOpenChange={(isOpen) => {
          setIsAddContactOpen(isOpen);

          if (!isOpen) {
            setNewContact({
              first_name: '',
              last_name: '',
              email: '',
              phone: '',
              address: '', // Ensure address is included
              groups: [],
            });
            setGroup('');
            setselectedgroups([]);
          }
        }}
      >
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Create New Contact</SheetTitle>
            <SheetDescription>Fill in the contact details carefully.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                value={newContact.first_name}
                onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={newContact.last_name}
                onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4" style={{ position: 'relative' }}>
              <Label htmlFor="group" className="text-right">
                Groups
              </Label>
              <input
                id="group"
                value={group}
                onChange={handleInputChange}
                placeholder="Enter group name..."
                className="col-span-2 p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleEnter(group);
                }}
                className="ml-2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition w-fit"
              >
                <Plus className="w-3 h-3" />
              </button>

              {/* Suggestions Dropdown */}
              {isDropdownOpen && (
                <>
                  <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-y-auto">
                    {groupSuggestions
                      .filter((g) => g.toLowerCase().includes(group.toLowerCase()))
                      .map((g) => (
                        <li
                          key={g}
                          onClick={() => handleSelectGroup(g)}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {g}
                        </li>
                      ))}
                  </ul>
                </>
              )}
              {/* </div> */}

              {/* Selected Items Display */}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedgroups.map((g, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1  flex items-center"
                  style={{ borderRadius: '4px' }}
                >
                  {g}
                  <X
                    className="ml-2 h-4 w-4 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveGroup(g)}
                  />
                </span>
              ))}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit contact sheet */}
      <Sheet open={editopen} onOpenChange={seteditopen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Edit Contact</SheetTitle>
            <SheetDescription>Update the contact details carefully.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                value={contactToEdit?.first_name}
                onChange={(e) =>
                  setContactToEdit({ ...contactToEdit!, first_name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={contactToEdit?.last_name}
                onChange={(e) => setContactToEdit({ ...contactToEdit!, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={contactToEdit?.email}
                onChange={(e) => setContactToEdit({ ...contactToEdit!, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={contactToEdit?.phone}
                onChange={(e) => setContactToEdit({ ...contactToEdit!, phone: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4" style={{ position: 'relative' }}>
              {/* <div className="relative flex items-center "> */}

              <Label htmlFor="group" className="text-right">
                Groups
              </Label>
              <input
                id="group"
                value={group}
                onChange={handleInputChange}
                placeholder="Enter group name..."
                className="col-span-2 p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleEnterEdit(group);
                }}
                className="ml-2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition w-fit"
              >
                <Plus className="w-3 h-3" />
              </button>

              {/* Suggestions Dropdown */}
              {isDropdownOpen && (
                <>
                  <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-y-auto">
                    {groupSuggestions
                      .filter((g) => g.toLowerCase().includes(group.toLowerCase()))
                      .map((g) => (
                        <li
                          key={g}
                          onClick={() => handleSelectGroupEdit(g)}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {g}
                        </li>
                      ))}
                  </ul>
                </>
              )}
              {/* </div> */}

              {/* Selected Items Display */}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {contactToEdit?.groups?.map((g, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1  flex items-center"
                  style={{ borderRadius: '4px' }}
                >
                  {g?.name}
                  <X
                    className="ml-2 h-4 w-4 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveGroupEdit(g.name)}
                  />
                </span>
              ))}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" onClick={() => seteditopen(false)}>
                Cancel
              </Button>
            </SheetClose>
            <Button onClick={handleUpdateContact}>Update Contact</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contacts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedContacts.length} contact(s)? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContacts}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
