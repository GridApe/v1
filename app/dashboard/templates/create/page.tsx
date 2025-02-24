'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailEditor, { EditorRef, EmailEditorProps, Editor } from 'react-email-editor';
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
import { Loader2, Save, Eye, Upload, Download, Undo, Redo, Variable, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

declare global {
  interface Window {
    unlayer: any;
  }
}

interface CompanySettingsDialogProps {
  companySettings: CompanySettings;
  setCompanySettings: React.Dispatch<React.SetStateAction<CompanySettings>>;
  handleLogoUpload: (file: File) => void;
  emailEditorRef: React.RefObject<EditorRef>;
  toast: any;
}

interface CompanySettings {
  businessName: string;
  logoUrl: string;
  businessAddress: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

const CompanySettingsDialog: React.FC<CompanySettingsDialogProps> = ({
  companySettings,
  setCompanySettings,
  handleLogoUpload,
  emailEditorRef,
  toast
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Building className="mr-2 h-4 w-4" /> Company Branding
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Company Branding</DialogTitle>
          <DialogDescription>
            Configure your company details for email templates
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessName" className="text-right">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={companySettings.businessName}
              onChange={(e) => setCompanySettings((prev: CompanySettings) => ({
                ...prev,
                businessName: e.target.value
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logoUrl" className="text-right">
              Logo
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="logoUrl"
                value={companySettings.logoUrl}
                onChange={(e) => setCompanySettings((prev: CompanySettings) => ({
                  ...prev,
                  logoUrl: e.target.value
                }))}
                placeholder="Enter logo URL or upload"
                className="flex-1"
              />
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleLogoUpload(file);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={companySettings.businessAddress}
              onChange={(e) => setCompanySettings((prev: CompanySettings) => ({
                ...prev,
                businessAddress: e.target.value
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="facebook" className="text-right">
              Facebook
            </Label>
            <Input
              id="facebook"
              value={companySettings.socialMedia.facebook}
              onChange={(e) => setCompanySettings((prev: CompanySettings) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, facebook: e.target.value }
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="twitter" className="text-right">
              Twitter
            </Label>
            <Input
              id="twitter"
              value={companySettings.socialMedia.twitter}
              onChange={(e) => setCompanySettings((prev: CompanySettings) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, twitter: e.target.value }
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linkedin" className="text-right">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={companySettings.socialMedia.linkedin}
              onChange={(e) => setCompanySettings((prev: CompanySettings) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
              }))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => {
            if (window.unlayer) {
              const defaultTemplate = {
                body: {
                  rows: [
                    {
                      cells: [1],
                      columns: [
                        {
                          contents: [
                            {
                              type: "text",
                              values: {
                                containerPadding: "10px",
                                text: `<div style='text-align: center;'>
                        <img src='${companySettings.logoUrl || ''}' alt='${companySettings.businessName}' style='max-width: 200px;'>
                        <p>${companySettings.businessName}</p>
                        <p>${companySettings.businessAddress}</p>
                        <div style='margin: 15px 0;'>
                          <a href='${companySettings.socialMedia.facebook || '#'}'>Facebook</a> | 
                          <a href='${companySettings.socialMedia.twitter || '#'}'>Twitter</a> | 
                          <a href='${companySettings.socialMedia.linkedin || '#'}'>LinkedIn</a>
                        </div>
                        <p>© ${new Date().getFullYear()} ${companySettings.businessName}. All rights reserved.</p>
                      </div>`
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              };

              window.unlayer.loadDesign(defaultTemplate);

              toast({
                title: 'Branding Updated',
                description: 'Company branding has been updated in the editor.',
              });
            }
          }}>
            Apply Branding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function EmailTemplateEditor() {

  const { setSidebarOpen } = useDashboardContext();

  const emailEditorRef = useRef<EditorRef | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [jsonData, setJsonData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const { toast } = useToast();

  const router = useRouter();

  const handleExit = () => {
    setSidebarOpen(true);
    router.back();
  };

  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(true);
  }, [setSidebarOpen]);

  const handleLogoUpload = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setCompanySettings(prev => ({
          ...prev,
          logoUrl: dataUrl
        }));
        toast({
          title: 'Logo Uploaded',
          description: 'Your company logo has been uploaded.',
        });
      };
      reader.readAsDataURL(file);
    },
    [toast]
  );

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    businessName: '',
    logoUrl: '',
    businessAddress: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: ''
    }
  });

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
      if (unlayer.addEventListener) {
        unlayer.addEventListener('design:updated', () => {
          setCanUndo(unlayer.isUndoable());
          setCanRedo(unlayer.isRedoable());
        });
      }

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
      })

      unlayer.setDesignTagsConfig({
        tags: [
          {
            name: 'Business Name',
            value: '[[ business_name ]]'
          },
          {
            name: 'Business Logo',
            value: '[[{ business_logo }]]'
          },
          {
            name: 'Business Address',
            value: '[[ business_address ]]'
          },
          {
            name: 'Current Year',
            value: '[[ current_year ]]'
          },
          {
            name: 'Facebook',
            value: '[[{ social_media.facebook }]]'
          },
          {
            name: 'Twitter',
            value: '[[{ social_media.twitter }]]'
          },
          {
            name: 'LinkedIn',
            value: '[[{ social_media.linkedin }]]'
          }
        ]
      });

      const defaultTemplate = {
        body: {
          rows: [
            {
              cells: [1],
              columns: [
                {
                  contents: [
                    {
                      type: "text",
                      values: {
                        containerPadding: "10px",
                        text: "<div style='text-align: center;'><img src='[[{ business_logo }]]' alt='[[ business_name ]]' style='max-width: 200px;'><p>[[ business_name ]]</p><p>[[ business_address ]]</p><div style='margin: 15px 0;'><a href='[[{ social_media.facebook }]]'>Facebook</a> | <a href='[[{ social_media.twitter }]]'>Twitter</a> | <a href='[[{ social_media.linkedin }]]'>LinkedIn</a></div><p>© [[ current_year ]] [[ business_name ]]. All rights reserved.</p></div>"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      };

      unlayer.loadDesign(defaultTemplate);

    },
    [companySettings]
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
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={handleExit}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Editor
        </Button>
      </div>
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
            // minHeight={500}
            style={{ width: '100%' }}
            options={{
              appearance: {
                theme: 'light',
                loader: {
                  url: 'https://app.gridape.com/logo.svg',
                },
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
            <CompanySettingsDialog
              companySettings={companySettings}
              setCompanySettings={setCompanySettings}
              handleLogoUpload={handleLogoUpload}
              emailEditorRef={emailEditorRef}
              toast={toast}
            />
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
