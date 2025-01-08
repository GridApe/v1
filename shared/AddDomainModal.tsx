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
  const [domain, setDomain] = useState('');
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDNSModal, setShowDNSModal] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/settings/add-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) throw new Error('Domain verification failed');

      const responseData = await response.json();
      const { spf_record, dkim_record, dmarc_record } = responseData.data.domain;

      setDnsRecords([
        { type: 'TXT (SPF)', hostname: domain, value: spf_record },
        { type: 'TXT (DKIM)', hostname: `default._domainkey.${domain}`, value: dkim_record },
        { type: 'TXT (DMARC)', hostname: `_dmarc.${domain}`, value: dmarc_record },
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
      console.error('Domain verification error:', error);
      toast({
        title: 'Verification Failed',
        description: 'Unable to add domain. Check domain name and try again.',
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
              <Label htmlFor="domain" className="mb-2 block">
                Domain Name
              </Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value.trim().toLowerCase())}
                placeholder="example.com"
                pattern="^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter the full domain you want to verify
              </p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isLoading || !domain} className="w-full">
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