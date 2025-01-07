'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface DNSRecord {
  type: string;
  hostname: string;
  value: string;
}

interface DNSRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dnsRecords: DNSRecord[];
}

export function DNSRecordModal({ open, onOpenChange, dnsRecords }: DNSRecordModalProps) {
  const [copiedRecord, setCopiedRecord] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (record: DNSRecord, index: number) => {
    const textToCopy = `${record.type},${record.hostname},${record.value}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopiedRecord(index);
        setTimeout(() => setCopiedRecord(null), 2000);
        toast({
          title: 'Copied!',
          description: 'DNS record copied to clipboard.',
        });
      })
      .catch((err) => {
        console.error('Clipboard copy failed:', err);
        toast({
          title: 'Copy Error',
          description: 'Could not copy to clipboard.',
          variant: 'destructive',
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center">
            <ShieldCheck className="mr-2 text-green-600 w-6 h-6" />
            DNS Records
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Add these records to your DNS provider to complete verification.
            </p>
            {dnsRecords.map((record, index) => (
              <div
                key={index}
                className="bg-muted/50 p-4 rounded-lg mb-3 border border-blue-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {record.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(record, index)}
                    className={copiedRecord === index ? 'bg-green-100' : ''}
                  >
                    {copiedRecord === index ? (
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedRecord === index ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <strong>Hostname:</strong>
                    <span className="ml-2 text-muted-foreground">{record.hostname}</span>
                  </p>
                  <p className="text-sm break-all">
                    <strong>Value:</strong>
                    <span className="ml-2 text-muted-foreground">{record.value}</span>
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}