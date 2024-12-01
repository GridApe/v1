'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useTemplateStore } from '@/store/templateStore';
import { TemplateTypes } from '@/types/interface';
import EmailEditor, { EditorRef } from 'react-email-editor';

export default function TemplatesPage() {
  const { user } = useAuthStore();
  const { templates, savedTemplates, loading, error } = useTemplateStore();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        await savedTemplates();
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    }
    fetchTemplates();
  }, [savedTemplates]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center gap-4 px-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/assets/logo.svg" alt="Logo" />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search document, template,...."
                className="w-full max-w-lg pl-8"
              />
            </div>
          </div>
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              12
            </span>
          </Button>
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Create email</span>
          <span>/</span>
          <span className="text-foreground">use template</span>
        </div>

        <div className="mb-8 flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Email purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All purposes</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="rounded-full">
            All
          </Button>
          <Button variant="outline" className="rounded-full">
            Saved template
          </Button>
        </div>

        {/* Loading, Error or Templates */}
        {loading ? (
          <p>Loading templates...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : templates && templates.length > 0 ? (
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-dashed">
              <CardContent className="flex min-h-[300px] flex-col items-center justify-center gap-4">
                <div className="rounded-full border-2 border-dashed p-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Add new template</p>
              </CardContent>
            </Card>

            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <h3 className="font-semibold">{template.name}</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{template.name}</p>
                  </div>
                  <div
                    className="aspect-video rounded-md bg-muted p-4 overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(template.content),
                    }}
                  />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  {template.name && `Type: ${template.name}`}
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        ) : (
          <p>No templates found.</p>
        )}
      </main>
    </div>
  );
}

interface EmailTemplatePreviewProps {
  content: string; // JSON string for the email template
}

function EmailTemplatePreview({ content }: EmailTemplatePreviewProps): JSX.Element {
  const emailEditorRef = useRef<EditorRef | null>(null);

  useEffect(() => {
    if (emailEditorRef.current) {
      emailEditorRef.current.editor?.loadDesign(JSON.parse(content));
    }
  }, [content]);

  return (
    <div className="h-[300px] overflow-hidden">
      <EmailEditor ref={emailEditorRef} options={{ displayMode: 'email' }} />
    </div>
  );
}
