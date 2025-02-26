'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { Loader2, Save, Eye, Upload, Download, Undo, Redo, Sparkles } from 'lucide-react';

export default function EmailTemplateEditor() {
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const load = () => {
    const loadthis = {
      "counters": {
        "u_row": 1,
        "u_column": 1,
        "u_content_text": 2,
        "u_content_button": 1
      },
      "body": {
        "id": "emailBody",
        "rows": [
          {
            "id": "row1",
            "cells": [1],
            "columns": [
              {
                "id": "column1",
                "contents": [
                  {
                    "id": "content1",
                    "type": "text",
                    "values": {
                      "text": "Welcome to our platform! We're excited to have you here. We offer a range of key features designed to enhance your experience. Please complete your profile to get the most out of our platform.",
                      "textAlign": "left"
                    }
                  },
                  {
                    "id": "content2",
                    "type": "button",
                    "values": {
                      "text": "Complete Your Profile",
                      "textAlign": "center",
                      "background": "#0000ff",
                      "color": "#ffffff",
                      "url": "https://www.example.com/complete-profile"
                    }
                  },
                  {
                    "id": "content3",
                    "type": "text",
                    "values": {
                      "text": "Let's get started and make the most of our features! If you need any assistance, don't hesitate to reach out.",
                      "textAlign": "left"
                    }
                  }
                ],
                "values": {}
              }
            ],
            "values": {}
          }
        ],
        "headers": [
          // Empty array but same structure as rows if needed
        ],
        "footers": [
          // Empty array but same structure as rows if needed
        ],
        "values": {
          "backgroundColor": "#ffffff",
          "fontFamily": {
            "label": "Arial",
            "value": "arial,helvetica,sans-serif"
          }
        }
      },
      "schemaVersion": 12
    };

    emailEditorRef.current?.editor?.loadDesign(loadthis);
  }
  const generateEmailTemplate = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a prompt.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();
      if (data.success) {
        emailEditorRef.current?.editor?.loadDesign(data.template);
        console.log({ d: data.template })
        toast({ title: 'AI Generated', description: 'Email content added successfully.' });
      } else {
        throw new Error(data.message || 'Failed to generate email content.');
      }
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">AI Email Generator</h1>
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Email with AI</DialogTitle>
            </DialogHeader>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your email content..."
            />
            <Button onClick={generateEmailTemplate} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Email
            </Button>
          </DialogContent>
        </Dialog>
        <Button>Load design</Button>
      </div>

      <EmailEditor ref={emailEditorRef} minHeight={500} style={{ width: '100%' }} />
    </div>
  );
}
