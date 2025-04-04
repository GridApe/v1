'use client';

import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
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
import { Skeleton } from '@/components/ui/skeleton';


const AudiencePage = () => {
  const [groupSuggestions, setGroupSuggestions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };

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

  const handleBulkUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileInputRef.current || !fileInputRef.current.files?.length) {
      toast({
        title: 'Upload Failed',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const file = fileInputRef.current.files[0];
    
    // Validate file type
    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an Excel (.xlsx, .xls) or CSV file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: 'Please upload a file smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('/api/user/audience/bulkupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        toast({
          title: 'Upload Successful',
          description: 'Your contacts have been successfully uploaded.',
          variant: 'default',
        });
        fetchContacts();
        formRef.current?.reset();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Failed to upload contacts. Please try again.';
      
      if (error.response?.data) {
        const apiError = error.response.data;
        
        if (apiError.message) {
          errorMessage = apiError.message;
        }
        
        if (apiError.errors) {
          const errorDetails = Object.entries(apiError.errors)
            .map(([field, messages]) => `${(messages as any[]).join(', ')}`)
            .join(' ');
          errorMessage += ` ${errorDetails}`;
        }
      }

      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      const response = await fetch(`/api/user/audience/export`);
      console.log(response);
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
      console.log(error);
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
        // console.error('Update Contact Error:', error);

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


useEffect(() => {
  if (activeTab === 'groups' && contacts.length > 0) {
    const sortedContacts = [...contacts].sort((a, b) => {
      const groupA = a.groups.length > 0 ? a.groups[0].name.toLowerCase() : '';
      const groupB = b.groups.length > 0 ? b.groups[0].name.toLowerCase() : '';
            return groupA.localeCompare(groupB);
    });
        setContacts(sortedContacts);
  } else if (activeTab === 'all-contacts') {
    fetchContacts();
  }
}, [activeTab]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#fafaff] to-[#f0f2f8] p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-900 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-[#0D0F56]">Audience Management</h1>
            <p className="text-gray-600 mt-1">Manage your contacts and audience segments</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="bg-white hover:bg-gray-50"
            >
              <FileUp className="mr-2 h-4 w-4" /> Export
            </Button>
            <form ref={formRef} onSubmit={handleBulkUpload} className="flex items-center gap-2">
              <label htmlFor="file">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white hover:bg-gray-50"
                  disabled={isUploading}
                >
                  <Plus className="mr-2 h-4 w-4" /> Bulk Upload
                </Button>
              </label>
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                name="file"
                accept=".xlsx,.csv,.xls"
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                type="submit" 
                variant="default" 
                size="sm"
                disabled={isUploading || !fileInputRef.current?.files?.length}
                className="relative"
              >
                {isUploading ? (
                  <>
                    <div className="absolute inset-0 bg-white/20 rounded-md" />
                    <div 
                      className="absolute inset-0 bg-blue-600 rounded-md transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className="relative z-10">
                      {uploadProgress}%
                    </span>
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" /> Upload
                  </>
                )}
              </Button>
            </form>
            <Button 
              size="sm" 
              onClick={() => setIsAddContactOpen(true)}
              className="bg-[#2E3192] hover:bg-[#1C1E5F]"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-64" />
            </div>
            <div className="rounded-lg border">
              <div className="p-4">
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        ) : contacts && contacts.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tabs and Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all-contacts" className="data-[state=active]:bg-white">
                    <Users className="mr-2 h-4 w-4" /> All Contacts
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="data-[state=active]:bg-white">
                    <Filter className="mr-2 h-4 w-4" /> Groups
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Selected Contacts Bar */}
            {selectedContacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 p-4 rounded-xl flex justify-between items-center border border-blue-100"
              >
                <span className="text-blue-700 font-medium">
                  {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                </span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                </Button>
              </motion.div>
            )}

            {/* Contacts Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
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
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {`${contact.first_name} ${contact.last_name}`}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.groups.length === 0 ? (
                            <span className="text-gray-500 text-sm">Unassigned</span>
                          ) : contact.groups.length === 1 ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                              {typeof contact.groups[0] === 'object' 
                                ? contact.groups[0]?.name 
                                : contact.groups[0]}
                            </span>
                          ) : (
                            <>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                                {typeof contact.groups[0] === 'object' 
                                  ? contact.groups[0]?.name 
                                  : contact.groups[0]}
                              </span>
                              <span className="text-gray-500 text-sm">
                                +{contact.groups.length - 1} more
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit({
                                ...contact,
                                groups: contact.groups.map((g) => g.name),
                              })}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openDeleteModal({
                                ...contact,
                                groups: contact.groups.map((g) => g.name),
                              })}
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
          </motion.div>
        ) : (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl p-8 mx-auto max-w-md shadow-lg border">
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
      </div>
    </motion.div>
  );
};

export default AudiencePage;
