'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, Edit, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { useCampaignStore } from '@/store/useCampaignStore';

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
          rows: []  // Empty rows for a blank template
        }
      })
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateTypes | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

  const {
    selectedTemplateId,
    setSelectedTemplateId,
    setSelectedTemplateState,
    action,
    setAction,
  } = useCampaignStore();

  useEffect(() => {
    async function fetchTemplates(): Promise<void> {
      try {
        setLoading(true);
        const response = await fetch('/api/user/templates/all');
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const responseData = await response.json();
        setTemplates(prev => [
          prev[0], // Keep the blank template
          ...(responseData.data.templates || [])
        ]);
      } catch (err) {
        setError((err as Error).message);
        // console.error('Error fetching templates:', err);
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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedTemplateState('selected');
    setAction(null);
    router.push('/dashboard/campaign/create');
  };

  const handlePreview = (template: TemplateTypes) => {
    setPreviewTemplate(template);
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/dashboard/templates/edit/${templateId}`);
  };

  const handleCreateNewTemplate = () => {
    router.push('/dashboard/templates/create');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Templates Library</h1>
        <Button className="w-full md:w-auto flex items-center space-x-2"
          onClick={handleCreateNewTemplate}
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
            <SelectItem value="category1">Category 1</SelectItem>
            <SelectItem value="category2">Category 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="mx-auto w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded text-red-700">
          Error: {error}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group relative hover:shadow-xl transition-all duration-300">
              {action === 'select_template' || action === 'change_template' ? (
                <div className="absolute rounded-xl inset-0 bg-black/0 group-hover:bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-10">
                  <Button
                    onClick={() => handleTemplateSelect(template.id)}
                    className="scale-0 group-hover:scale-100 transition-transform duration-300 px-10 mb-2"
                  >
                    Select
                  </Button>
                  <Button
                    onClick={() => handlePreview(template)}
                    className="scale-0 group-hover:scale-100 transition-transform duration-300 px-10"
                    variant="secondary"
                  >
                    Preview
                  </Button>
                </div>
              ) : null}
              <CardHeader>
                <h2 className="text-lg font-semibold truncate">{template.name}</h2>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
              {action !== 'select_template' && action !== 'change_template' && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2"
                    onClick={() => {
                      if (template.id === 'blank') {
                        handleCreateNewTemplate();
                      } else {
                        handleEditTemplate(template.id);
                      }
                    }}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center space-x-2"
                    onClick={() => handlePreview(template)}
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">No templates found matching your search.</p>
        </div>
      )}

      <AnimatePresence>
        {previewTemplate && (
          <Dialog open onOpenChange={() => setPreviewTemplate(null)}>
            <DialogContent className="max-w-4xl">
              <DialogTitle>{previewTemplate.name}</DialogTitle>
              <div className="w-full aspect-video border border-gray-300 rounded overflow-hidden">
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
    </div>
  );
}

