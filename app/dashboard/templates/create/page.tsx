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
import { Textarea } from '@/components/ui/textarea';
import { Toast } from '@/components/ui/toast';
import { Loader2, Save, Eye, Upload, Download, Undo, Redo, Variable } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmailTemplateEditor() {
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const { toast } = useToast();

  // Function to add non-removable footer
  const addNonRemovableFooter = (unlayer: any) => {
    const footerHtml = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #ffffff;
        text-align: center;
        padding: 10px;
        filter: invert(1);
        pointer-events: none;
        user-select: none;
      ">dd
        <img src="/logo.svg" alt="Sent using" style="height: 30px; width: auto;"/>
      </div>
    `;

    // Add custom CSS to prevent removal
    unlayer.addEventListener('design:updated', () => {
      const frame = document.querySelector('iframe[name="editor-frame"]');
      if (frame) {
        const frameDoc = (frame as HTMLIFrameElement).contentDocument;
        if (frameDoc) {
          let style = frameDoc.createElement('style');
          style.textContent = `
            .footer-wrapper {
              position: fixed !important;
              bottom: 0 !important;
              left: 0 !important;
              width: 100% !important;
              pointer-events: none !important;
              user-select: none !important;
              z-index: 9999 !important;
            }
          `;
          frameDoc.head.appendChild(style);
        }
      }
    });

    // Inject footer into every exported design
    unlayer.addEventListener('design:exported', (data: any) => {
      data.html = data.html.replace('</body>', `${footerHtml}</body>`);
    });
  };

  const saveTemplate = async ({
    name,
    content,
    html,
  }: {
    name: string;
    content: string;
    html: string;
  }): Promise<{ success: boolean; message: string }> => {
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
      return { success: true, message: 'Template saved successfully!' };
    } catch (error: any) {
      console.error('Error saving template:', error);
      return { success: false, message: error.message || 'Something went wrong' };
    }
  };

  const onReady: EmailEditorProps['onReady'] = useCallback(
    (unlayer: any) => {
      setIsLoading(false);
      unlayer.addEventListener('design:updated', () => {
        setCanUndo(unlayer.isUndoable());
        setCanRedo(unlayer.isRedoable());
      });

      // Add the non-removable footer
      addNonRemovableFooter(unlayer);

      unlayer.setDesignTags({
        business_name: 'SpaceX',
        current_user_name: 'John Doe',
      });
      unlayer.setMergeTags({
        first_name: {
          name: 'First Name',
          value: '{{first_name}}',
        },
        last_name: {
          name: 'Last Name',
          value: '{{last_name}}',
        },
        emails: {
          name: 'Email',
          value: '{{email}}',
        },
        phone: {
          name: 'Phone',
          value: '{{phone}}',
        },
      });
    },
    []
  );

  const saveDesign = useCallback(() => {
    emailEditorRef.current?.editor?.saveDesign((design: any) => {
      setJsonData(JSON.stringify(design));
      emailEditorRef.current?.editor?.exportHtml((data: { html: string }) => {
        saveTemplate({
          name: templateName,
          content: JSON.stringify(design),
          html: data.html,
        })
          .then((result) => {
            if (result.success) {
              toast({
                title: 'Design Saved',
                description: 'Your email template design has been saved.',
              });
              // router.push('/dashboard/templates/saved');
            } else {
              throw new Error(result.message);
            }
          })
          .catch((error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to save template. Please try again later.',
              variant: 'destructive',
            });
          });
      });
    });
  }, [toast, saveTemplate, templateName]);

  const exportHtml = useCallback(() => {
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { html } = data;
      console.log('HTML Output:', html);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName || 'email-template'}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: 'Template Exported',
        description: 'Your email template has been exported as HTML.',
      });
    });
  }, [templateName, toast]);

  const togglePreview = useCallback(() => {
    if (previewMode) {
      emailEditorRef.current?.editor?.hidePreview();
    } else {
      emailEditorRef.current?.editor?.showPreview({ device: 'desktop' });
    }
    setPreviewMode((prev) => !prev);
  }, [previewMode]);

  const loadDesign = useCallback(() => {
    try {
      const design = JSON.parse(jsonData);
      emailEditorRef.current?.editor?.loadDesign(design);
      toast({
        title: 'Design Loaded',
        description: 'Your email template design has been loaded.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to load design. Please check your JSON data. ${error}`,
        variant: 'destructive',
      });
    }
  }, [jsonData, toast]);

  const undoAction = useCallback(() => {
    emailEditorRef.current?.editor?.undo();
  }, []);

  const redoAction = useCallback(() => {
    emailEditorRef.current?.editor?.redo();
  }, []);

  const handleImageUpload = useCallback(
    (file: File, onSuccess: (url: string) => void) => {
      // Here you would typically upload the file to your server or a file storage service
      // For this example, we'll create a local object URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onSuccess(dataUrl);
        toast({
          title: 'Image Uploaded',
          description: 'Your image has been successfully uploaded.',
        });
      };
      reader.readAsDataURL(file);
    },
    [toast]
  );


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undoAction();
        } else if (e.key === 'y') {
          e.preventDefault();
          redoAction();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoAction, redoAction]);

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
            {isLoading && (
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
          <EmailEditor
            ref={emailEditorRef}
            onReady={onReady}
            minHeight={500}
            style={{ width: '100%' }}
            options={{
              appearance: {
                theme: 'dark',
              },
              displayMode: 'email',
              designMode: 'edit',
              mergeTags: {
                first_name: {
                  name: 'First Name',
                  value: '{{first_name}}',
                },
                last_name: {
                  name: 'Last Name',
                  value: '{{last_name}}',
                },
                email: {
                  name: 'Email',
                  value: '{{email}}',
                },
                phone: {
                  name: 'Phone',
                  value: '{{phone}}',
                },
              },
              
              features: {
                stockImages: true,
                sendTestEmail: true
              },
              tools: {
                button: {
                  enabled: true,
                },
                text: {
                  enabled: true,
                },
                variable: {
                  enabled: true,
                },
              },
              customJS: [
                `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js`,
              ],
            }}
            projectId={1} // Replace with your actual Unlayer project ID
            onLoad={() => {
              emailEditorRef.current?.editor?.addEventListener(
                'image:added',
                (file: File, done: (arg0: { progress: number; url: string }) => void) => {
                  if (file) {
                    handleImageUpload(file, (url) => {
                      done({ progress: 100, url });
                    });
                  }
                }
              );
            }}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" /> Save Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Template</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={saveDesign}>Save Design</Button>
                  <Button onClick={exportHtml}>Export HTML</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={togglePreview}>
              <Eye className="mr-2 h-4 w-4" /> {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={undoAction} disabled={!canUndo}>
              <Undo className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button onClick={redoAction} disabled={!canRedo}>
              <Redo className="mr-2 h-4 w-4" /> Redo
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Load Design
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load Design</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder="Paste your JSON design data here"
                  className="min-h-[200px]"
                />
                <Button onClick={loadDesign}>Load Design</Button>
              </DialogContent>
            </Dialog>
            <Button onClick={exportHtml}>
              <Download className="mr-2 h-4 w-4" /> Export HTML
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Toast />
    </motion.div>
  );
}

// import React from 'react';

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
