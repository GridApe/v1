'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DNSRecordModal } from './DNSRecordModal';

interface DNSRecord {
  type: string;
  hostname: string;
  value: string;
}

export function AddDomainModal({
  open,
  onOpenChange,
  onDomainAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDomainAdded?: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDNSModal, setShowDNSModal] = useState(false);
  const { toast } = useToast();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const domain = email.split('@')[1];
      const response = await fetch('/api/user/settings/add-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) throw new Error('Domain verification failed');

      const responseData = await response.json();
      const { spf_record, dkim_record, dmarc_record } = responseData.data.domain;

      setDnsRecords([
        { type: spf_record.type, hostname: spf_record.host, value: spf_record.value },
        { type: dkim_record.type, hostname: dkim_record.host, value: dkim_record.value },
        { type: dmarc_record.type, hostname: dmarc_record.host, value: dmarc_record.value },
      ]);

      toast({
        title: 'Domain Added',
        description: 'DNS records generated. Configure with your DNS provider.',
        variant: 'default',
      });

      onDomainAdded?.();
      onOpenChange(false);
      setShowDNSModal(true);
    } catch (error) {
      // console.error('Domain verification error:', error);
      toast({
        title: 'Verification Failed',
        description: 'Unable to add domain. Check email and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center space-x-4">
              <Globe className="w-8 h-8 text-blue-600" />
              <div>
                <DialogTitle className="text-2xl">Add New Domain</DialogTitle>
                <DialogDescription>
                  Verify your domain to improve email deliverability and sender reputation.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                placeholder="you@example.com"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter your email address for verification.
              </p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isLoading || !name || !email} className="w-full">
                    {isLoading ? (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4 animate-pulse" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Verify Domain
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Initiate domain verification process</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </DialogContent>
      </Dialog>

      <DNSRecordModal
        open={showDNSModal}
        onOpenChange={setShowDNSModal}
        dnsRecords={dnsRecords}
      />
    </>
  );
}

