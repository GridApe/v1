'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Edit, Search, Filter, Grid, List, Layout, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { TemplateTypes } from '@/types/interface';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateTypes[]>([
    {
      id: 'blank',
      name: 'Blank Template',
      html: '<html><body style="margin: 0; padding: 0; font-family: Arial, sans-serif;"></body></html>',
      category: 'custom',
      content: JSON.stringify({
        body: {
          rows: []
        }
      })
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateTypes | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTemplates(): Promise<void> {
      try {
        setLoading(true);
        const response = await fetch('/api/templates');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const responseData = await response.json();
        setTemplates(prev => [
          prev[0],
          ...(responseData.data.templates || [])
        ]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  useEffect(() => {
    Object.values(iframeRefs.current).forEach((iframe) => {
      if (iframe) {
        const resizeIframe = () => {
          iframe.style.height = `${iframe.contentWindow?.document.body?.scrollHeight || 240}px`;
        };
        iframe.addEventListener('load', resizeIframe);
        return () => iframe.removeEventListener('load', resizeIframe);
      }
    });
  }, [templates, searchQuery, categoryFilter]);

  const filteredTemplates = templates.filter(
    (template) =>
      (searchQuery === '' || template.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === 'all' || template.category === categoryFilter)
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const saveTemplate = async ({
    name,
    content,
    html,
  }: {
    name: string;
    content: string;
    html: string;
  }): Promise<{ success: boolean; message: string; id?: string }> => {
    try {
      const payload = {
        name,
        content,
        html,
      };

      const response = await fetch('/api/user/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Failed to save template' };
      }

      const data = await response.json();

      const id = data?.data?.template?.id;
      if (id) {
        return { success: true, message: 'Template saved successfully', id };
      } else {
        return { success: false, message: 'Template saved, but no ID returned' };
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      return { success: false, message: error.message || 'Something went wrong' };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Templates Library</h1>
          <p className="text-muted-foreground">Create and manage your email templates</p>
        </div>
        <Button
          className="w-full md:w-auto flex items-center space-x-2"
          onClick={() => { router.push('/dashboard/templates/create') }}
        >
          <Plus size={16} />
          <span>Create New Template</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full">
          <Input
            placeholder="Search templates..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Filter size={16} />
              <SelectValue placeholder="Filter by category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="transactional">Transactional</SelectItem>
            <SelectItem value="welcome">Welcome</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-red-100">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-red-700">Error Loading Templates</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredTemplates.length > 0 ? (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTemplates.map((template) => (
                <motion.div key={template.id} variants={item}>
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <h2 className="text-lg font-semibold truncate">{template.name}</h2>
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden border">
                        <iframe
                          ref={(el) => {
                            if (el) iframeRefs.current[template.id] = el;
                          }}
                          srcDoc={template.html}
                          title={`Template Preview - ${template.name}`}
                          className="w-full h-full object-cover"
                          sandbox="allow-same-origin allow-scripts allow-popups"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => {
                          if (template.id === 'blank') {
                            router.push('/dashboard/templates/create');
                          } else {
                            saveTemplate({
                              name: template.name,
                              content: template.content,
                              html: template.html,
                            }).then((result) => {
                              if (result.success && result.id) {
                                router.push(`/dashboard/templates/edit/${result.id}`);
                              } else {
                                throw new Error(result.message);
                              }
                            })
                              .catch((error) => {
                                toast({
                                  title: 'Error',
                                  description: error.message || 'Failed to use template. Please try again later.',
                                  variant: 'destructive',
                                });
                              });
                          }
                        }}
                      >
                        <Edit size={14} />
                        <span>Use</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye size={14} />
                        <span>Preview</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTemplates.map((template) => (
                <motion.div key={template.id} variants={item}>
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <div className="w-48 aspect-video bg-gray-50 rounded-lg overflow-hidden border">
                          <iframe
                            ref={(el) => {
                              if (el) iframeRefs.current[template.id] = el;
                            }}
                            srcDoc={template.html}
                            title={`Template Preview - ${template.name}`}
                            className="w-full h-full object-cover"
                            sandbox="allow-same-origin allow-scripts allow-popups"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{template.name}</h2>
                            <Badge variant="outline" className="capitalize">
                              {template.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-2"
                              onClick={() => {
                                if (template.id === 'blank') {
                                  router.push('/dashboard/templates/create');
                                } else {
                                  router.push(`/dashboard/templates/edit/${template.id}`);
                                }
                              }}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              className="flex items-center space-x-2"
                              onClick={() => setPreviewTemplate(template)}
                            >
                              <Eye size={14} />
                              <span>Preview</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Layout className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
            <p className="text-muted-foreground mb-4">
              No templates match your search criteria. Try adjusting your filters or create a new template.
            </p>
            <Button onClick={() => router.push('/dashboard/templates/create')}>
              Create New Template
            </Button>
          </CardContent>
        </Card>
      )
      }

      <AnimatePresence>
        {previewTemplate && (
          <Dialog open onOpenChange={() => setPreviewTemplate(null)}>
            <DialogContent className="max-w-4xl">
              <DialogTitle>{previewTemplate.name}</DialogTitle>
              <div className="w-full aspect-video border rounded-lg overflow-hidden bg-gray-50">
                <iframe
                  srcDoc={previewTemplate.html}
                  title={`Preview - ${previewTemplate.name}`}
                  className="w-full h-full"
                  sandbox="allow-same-origin allow-scripts allow-popups"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div >
  );
}
