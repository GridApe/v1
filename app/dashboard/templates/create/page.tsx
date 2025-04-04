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
import { Loader2, Save, Eye, Upload, Download, Undo, Redo, Variable, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { withAuth } from '@/shared/withAuth';

function CreateTemplatePage() {
  const router = useRouter();
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (emailEditorRef.current?.editor) {
        emailEditorRef.current.editor.saveDesign((design: any) => {
          const currentDesign = JSON.stringify(design);
          if (currentDesign !== jsonData) {
            setJsonData(currentDesign);
            setLastSaved(new Date());
            // Save to localStorage for recovery
            localStorage.setItem('template_draft', currentDesign);
            localStorage.setItem('template_name', templateName);
          }
        });
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [jsonData, templateName]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('template_draft');
    const savedName = localStorage.getItem('template_name');
    
    if (savedDraft && savedName) {
      setJsonData(savedDraft);
      setTemplateName(savedName);
      // Load the design after the editor is ready
      if (emailEditorRef.current?.editor) {
        try {
          const design = JSON.parse(savedDraft);
          emailEditorRef.current.editor.loadDesign(design);
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, []);

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
      // console.error('Error saving template:', error);
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
      // console.log('HTML Output:', html);
      // console.log('HTML Output:', html);
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Create Email Template</h1>
          </div>
          <p className="text-muted-foreground">Design your email template using our drag-and-drop editor</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Auto-save enabled'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Template Editor</CardTitle>
                <CardDescription>Drag and drop elements to create your email template</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undoAction}
                  disabled={!canUndo}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redoAction}
                  disabled={!canRedo}
                >
                  <Redo className="h-4 w-4 mr-2" />
                  Redo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative min-h-[600px]">
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
                  >
                    <div className="text-center space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">Loading editor...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <EmailEditor
                ref={emailEditorRef}
                onReady={onReady}
                minHeight={600}
                style={{ width: '100%' }}
                options={{
                  appearance: {
                    theme: 'light',
                    panels: {
                      tools: {
                        dock: 'left'
                      }
                    }
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
                projectId={1}
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
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Actions</CardTitle>
              <CardDescription>Save, export, or load your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
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
                        placeholder="Enter template name"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button onClick={saveDesign}>Save Design</Button>
                    <Button onClick={exportHtml}>Export HTML</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={togglePreview}
              >
                <Eye className="mr-2 h-4 w-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Load Design
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
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button onClick={loadDesign}>Load Design</Button>
                </DialogContent>
              </Dialog>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={exportHtml}
              >
                <Download className="mr-2 h-4 w-4" />
                Export HTML
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Merge Tags</CardTitle>
              <CardDescription>Available variables for your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm">First Name</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{"{{first_name}}"}</code>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm">Last Name</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{"{{last_name}}"}</code>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm">Email</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{"{{email}}"}</code>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                <span className="text-sm">Phone</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{"{{phone}}"}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toast />
    </motion.div>
  );
}

export default CreateTemplatePage;

// import React from 'react';

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
