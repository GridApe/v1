'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Send, Clock, FileText } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  title: string;
  status: string;
  scheduled_at: string;
  opened_count: number;
  clicked_count: number;
  created_at: string;
  user_email_template_id: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/campaign/all');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const result = await response.json();
      setCampaigns(result.data.campaigns);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch campaigns. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      const response = await fetch(`/api/user/campaign/${campaignToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
      
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignToDelete));
      toast({
        title: 'Campaign Deleted',
        description: 'The campaign has been successfully deleted.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete campaign. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'pending':
        return 'warning';
      case 'draft':
        return 'secondary';
      default:
        return 'default';
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="p-6 mx-auto max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0D0F56]">Email Campaigns</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-pulse">Loading campaigns...</div>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[250px]">Campaign Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled At</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => {
                const openRate = campaign.opened_count > 0 
                  ? ((campaign.opened_count / 100) * 100).toFixed(2) 
                  : '0.00';
                const clickRate = campaign.clicked_count > 0 
                  ? ((campaign.clicked_count / 100) * 100).toFixed(2) 
                  : '0.00';

                return (
                  <TableRow key={campaign.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-gray-500" />
                      {campaign.title}
                    </TableCell>
                    <TableCell>
                    <Badge variant={getStatusVariant(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        {format(parseISO(campaign.scheduled_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>{openRate}%</TableCell>
                    <TableCell>{clickRate}%</TableCell>
                    <TableCell>
                      {format(parseISO(campaign.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" /> Send Now
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setCampaignToDelete(campaign.id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No campaigns found. Create your first campaign!</p>
          <Button className="mt-4" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCampaign}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}