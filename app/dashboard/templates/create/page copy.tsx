'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTemplateStore } from '@/store/templateStore';

export default function EmailTemplateEditor() {
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const { templates, saveTemplate, listAllTemplates, loading } = useTemplateStore();
  const { toast } = useToast();

  const onReady: EmailEditorProps['onReady'] = useCallback((unlayer: any) => {
    unlayer.addEventListener('design:updated', () => {
      console.log('Design updated');
    });
  }, []);

  const saveDesign = useCallback(() => {
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { html } = data;
      saveTemplate({
        name: templateName,
        content: html,
      })
        .then(() => {
          toast({
            title: 'Template Saved',
            description: 'Your email template has been successfully saved.',
          });
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to save template. Please try again later.',
            variant: 'destructive',
          });
        });
    });
  }, [saveTemplate, templateName, toast]);

  useEffect(() => {
    // Load templates on component mount
    listAllTemplates();
  }, [listAllTemplates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold">Email Template Editor</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Template Editor</CardTitle>
          <CardDescription>Create your email template using drag and drop</CardDescription>
        </CardHeader>
        <CardContent className="relative min-h-[500px]">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
              >
                <Loader2 className="h-8 w-8 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          <EmailEditor ref={emailEditorRef} onReady={onReady} minHeight={500} />
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="col-span-1">
                Template Name
              </Label>
              <Input
                id="name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <Button onClick={saveDesign} disabled={!templateName || loading}>
              <Save className="mr-2 h-4 w-4" /> Save Template
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
