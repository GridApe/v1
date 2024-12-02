'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Globe, ShieldCheck, ServerIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DNSRecord {
  type: string;
  hostname: string;
  value: string;
}

export function AddDomainModal({ 
  open, 
  onOpenChange,
  onDomainAdded 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onDomainAdded?: () => void 
}) {
  const [domain, setDomain] = useState('')
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedRecord, setCopiedRecord] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/settings/add-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      
      if (!response.ok) throw new Error('Domain verification failed');
      
      const responseData = await response.json();
      const { spf_record, dkim_record, dmarc_record } = responseData.data.domain
      
      setDnsRecords([
        { type: 'TXT (SPF)', hostname: domain, value: spf_record },
        { type: 'TXT (DKIM)', hostname: `default._domainkey.${domain}`, value: dkim_record },
        { type: 'TXT (DMARC)', hostname: `_dmarc.${domain}`, value: dmarc_record },
      ])
      
      toast({
        title: "Domain Added",
        description: "DNS records generated. Configure with your DNS provider.",
        variant: "default",
      })

      onDomainAdded?.();
    } catch (error) {
      console.error('Domain verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Unable to add domain. Check domain name and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (record: DNSRecord, index: number) => {
    const textToCopy = `${record.type},${record.hostname},${record.value}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedRecord(index)
      setTimeout(() => setCopiedRecord(null), 2000)
      toast({
        title: "Copied!",
        description: "DNS record copied to clipboard.",
      })
    }).catch((err) => {
      console.error('Clipboard copy failed:', err)
      toast({
        title: "Copy Error",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="domain" className="mb-2 block">Domain Name</Label>
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
                      <Button 
                        type="submit" 
                        disabled={isLoading || !domain} 
                        className="w-full"
                      >
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
                    <TooltipContent>
                      Initiate domain verification process
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {dnsRecords.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ShieldCheck className="mr-2 text-green-600" />
                    DNS Records
                  </h3>
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
                          className={copiedRecord === index ? "bg-green-100" : ""}
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}