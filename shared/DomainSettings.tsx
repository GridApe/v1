'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusSquare, Globe, Link as LinkIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { AddDomainModal } from './AddDomainModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Domain {
  id: string;
  brandName: string;
  domain: string;
  status: 'verified' | 'pending' | 'failed';
  verifiedAt: string | null;
}

export default function DomainSettings() {
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/domains');
      if (!response.ok) throw new Error('Failed to fetch domains');

      const responseData = await response.json();
      setDomains(responseData.data.domains);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to load domains. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDomainAdded = () => {
    fetchDomains();
    setIsAddDomainOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 bg-gradient-to-br shadow-none from-blue-50 to-blue-100/50">
          <CardHeader className="border-b border-blue-200/50">
            <CardTitle className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-blue-600" />
              <span>Domain Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <p className="text-muted-foreground mb-6">
              Verify and manage your email domains to ensure reliable communication and build trust
              with your secure email infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-blue-500 text-blue-700 hover:bg-blue-50"
                      onClick={() => setIsAddDomainOpen(true)}
                    >
                      <PlusSquare className="mr-2 h-4 w-4" /> Add New Domain
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add a new domain to your account</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 shadow-none to-purple-100/50">
          <CardHeader className="border-b border-purple-200/50">
            <CardTitle className="flex items-center space-x-3">
              <LinkIcon className="w-6 h-6 text-purple-600" />
              <span>Domain Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Domains</span>
                <span className="font-bold">{domains.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verified Domains</span>
                <span className="font-bold">
                  {domains.filter((d) => d.status === 'verified').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-white shadow-none">
          <CardHeader className="border-b">
            <CardTitle>Existing Domains</CardTitle>
          </CardHeader>
          <CardContent className="">
            <Table>
              <TableCaption>
                {isLoading ? 'Loading domains...' : 'List of your registered domains'}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Brand Name</TableHead>
                  <TableHead>Domain Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-[70px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : domains.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No domains added yet. Click "Add New Domain" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  domains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">{domain.domain}</TableCell>
                      <TableCell>
                        <Link
                          href={`https://${domain.domain}`}
                          className="hover:underline text-blue-600 flex items-center"
                          target="_blank"
                        >
                          {domain.domain}
                          <LinkIcon className="ml-2 h-4 w-4" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={domain.status === 'verified' ? 'default' : 'destructive'}
                          className={
                            domain.status === 'verified'
                              ? 'bg-green-500'
                              : domain.status === 'pending'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }
                        >
                          {domain.status?.charAt(0).toUpperCase() + domain.status?.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddDomainModal
        open={isAddDomainOpen}
        onOpenChange={setIsAddDomainOpen}
        onDomainAdded={handleDomainAdded}
      />
    </div>
  );
}
