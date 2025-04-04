'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { Loader2, Save, Eye, Download, ChevronLeft, ArrowRight, Sparkles, ArrowLeft, Mail, Undo, Redo, User, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import TopBar from '@/app/components/shared/TopBar';

interface EmailFormData {
  emailAbout: string;
  businessType: string;
  targetAudience: string;
  emailStyle: string;
}

const EMAIL_STYLES = [
  'Inspirational',
  'Informative',
  'Assertive',
  'Formal',
  'Neutral',
  'Informal'
] as const;

const STYLE_DESCRIPTIONS = {
  'Inspirational': 'Motivate and inspire your audience',
  'Informative': 'Educate and inform with clarity',
  'Assertive': 'Communicate with confidence',
  'Formal': 'Professional and structured',
  'Neutral': 'Balanced and versatile',
  'Informal': 'Casual and friendly approach'
};

export default function EmailTemplateEditor() {
  const router = useRouter();
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | null>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>('');
  const [jsonData, setJsonData] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form state
  const [formData, setFormData] = useState<EmailFormData>({
    emailAbout: '',
    businessType: '',
    targetAudience: '',
    emailStyle: 'Neutral'
  });

  // Word count for email about
  const wordCount = formData.emailAbout.trim().split(/\s+/).filter(Boolean).length;
  const MAX_WORDS = 150;

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    if (field === 'emailAbout' && value.trim().split(/\s+/).filter(Boolean).length > MAX_WORDS) {
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.emailAbout || !formData.businessType || !formData.targetAudience) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all fields before proceeding.',
          variant: 'destructive'
        });
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.back();
    }
  };

  const simulateProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
    return interval;
  };

  const generateEmailTemplate = async () => {
    if (!formData.emailStyle) {
      toast({
        title: 'Missing Style',
        description: 'Please select an email style before generating.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    const progressInterval = simulateProgress();

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        // Set currentStep to null first to trigger the transition
        setCurrentStep(null);
        
        // Store the template data
        setJsonData(data.template);
        
        // If editor is ready, load the design
        if (emailEditorRef.current?.editor) {
          try {
            emailEditorRef.current.editor.loadDesign(data.template);
            toast({ 
              title: 'AI Generated', 
              description: 'Email template generated successfully.' 
            });
          } catch (error) {
            console.error('Error loading design:', error);
            toast({
              title: 'Warning',
              description: 'Template generated but there was an error loading it. Please refresh the page.',
              variant: 'destructive'
            });
          }
        }
      } else {
        throw new Error(data.message || 'Failed to generate email content.');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setGenerationProgress(0);
      toast({ 
        title: 'Error', 
        description: 'Failed to generate template. Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePreview = useCallback(() => {
    if (previewMode) {
      emailEditorRef.current?.editor?.hidePreview();
    } else {
      emailEditorRef.current?.editor?.showPreview({ device: 'desktop' });
    }
    setPreviewMode((prev) => !prev);
  }, [previewMode]);

  const exportHtml = useCallback(() => {
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { html } = data;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.html';
      a.click();
      URL.revokeObjectURL(url);
      setShowExportModal(false);
      toast({
        title: 'Success',
        description: 'Template exported as HTML.',
      });
    });
  }, [toast]);

  const loadTemplateFromState = useCallback(() => {
    if (!jsonData) {
      toast({
        title: 'No Template',
        description: 'No template data available to load.',
        variant: 'destructive'
      });
      return;
    }

    if (emailEditorRef.current?.editor) {
      try {
        const design = JSON.parse(jsonData);
        emailEditorRef.current.editor.loadDesign(design);
        toast({
          title: 'Success',
          description: 'Template loaded successfully.',
        });
      } catch (error) {
        console.error('Error loading template:', error);
        toast({
          title: 'Error',
          description: 'Failed to load template. Please try again.',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Editor Not Ready',
        description: 'Please wait for the editor to load.',
        variant: 'destructive'
      });
    }
  }, [jsonData, toast]);

  const onReady = useCallback((unlayer: any) => {
    console.log('Editor ready');
    setIsLoading(false);
    
    // Set up event listeners
    unlayer.addEventListener('design:updated', () => {
      setCanUndo(unlayer.isUndoable());
      setCanRedo(unlayer.isRedoable());
    });

    // Set up merge tags
    unlayer.setMergeTags({
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
    });

    // Load any saved draft or generated template if it exists
    const savedDraft = localStorage.getItem('template_draft');
    const savedName = localStorage.getItem('template_name');
    
    if (savedDraft && savedName) {
      setJsonData(savedDraft);
      setTemplateName(savedName);
      try {
        const design = JSON.parse(savedDraft);
        unlayer.loadDesign(design);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    } else if (jsonData) {
      // If we have generated template data, load it
      try {
        const design = JSON.parse(jsonData);
        unlayer.loadDesign(design);
      } catch (error) {
        console.error('Error loading generated template:', error);
      }
    }
  }, [jsonData]);

  const undoAction = useCallback(() => {
    emailEditorRef.current?.editor?.undo();
  }, []);

  const redoAction = useCallback(() => {
    emailEditorRef.current?.editor?.redo();
  }, []);

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
      return { success: false, message: error.message || 'Something went wrong' };
    }
  };

  const saveDesign = useCallback(() => {
    emailEditorRef.current?.editor?.saveDesign((design: any) => {
      setJsonData(JSON.stringify(design));
      emailEditorRef.current?.editor?.exportHtml((data: { html: string }) => {
        saveTemplate({
          name: templateName || formData.emailAbout.substring(0, 50) || 'AI Generated Template',
          content: JSON.stringify(design),
          html: data.html,
        })
          .then((result) => {
            if (result.success) {
              toast({
                title: 'Design Saved',
                description: 'Your email template design has been saved.',
              });
              setLastSaved(new Date());
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
  }, [toast, saveTemplate, templateName, formData.emailAbout]);

  // Add auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (emailEditorRef.current?.editor) {
        emailEditorRef.current.editor.saveDesign((design: any) => {
          const currentDesign = JSON.stringify(design);
          if (currentDesign !== jsonData) {
            setJsonData(currentDesign);
            setLastSaved(new Date());
            localStorage.setItem('template_draft', currentDesign);
            localStorage.setItem('template_name', templateName);
          }
        });
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [jsonData, templateName]);

  // Add draft loading on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('template_draft');
    const savedName = localStorage.getItem('template_name');
    
    if (savedDraft && savedName) {
      setJsonData(savedDraft);
      setTemplateName(savedName);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <TopBar 
        title="Email Template Creator"
        description="Create beautiful email templates with AI"
        showBackButton={false}
      />
      <main className="container mx-auto px-4 py-8">
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
                <h1 className="text-2xl md:text-3xl font-bold">AI Email Template Creator</h1>
              </div>
              <p className="text-muted-foreground">Create beautiful email templates with AI assistance</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="space-y-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Basic Information</CardTitle>
                        <CardDescription>
                          Tell us about your email campaign to help us generate the perfect template
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium flex items-center gap-1">
                        What's your Email about?
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        value={formData.emailAbout}
                        onChange={(e) => handleInputChange('emailAbout', e.target.value)}
                        placeholder="e.g 'Effects of climate change to the environment'"
                        className="min-h-[150px] resize-none text-base p-4 rounded-lg focus-visible:ring-primary"
                      />
                      <div className="flex justify-end">
                        <Badge variant={wordCount > MAX_WORDS * 0.8 ? "destructive" : "secondary"} className="text-xs">
                          {wordCount}/{MAX_WORDS} words
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium flex items-center gap-1">
                        What kind of business do you have?
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        placeholder="e.g 'Education'"
                        className="text-base p-4 h-12 rounded-lg focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium flex items-center gap-1">
                        Who is the email for?
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.targetAudience}
                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                        placeholder="e.g 'University students'"
                        className="text-base p-4 h-12 rounded-lg focus-visible:ring-primary"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between py-4 px-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <Button 
                      variant="outline" 
                      onClick={() => router.back()}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      className="rounded-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : currentStep === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="space-y-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Email Style</CardTitle>
                        <CardDescription>
                          Choose the perfect tone for your email to engage your audience effectively
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {EMAIL_STYLES.map((style) => (
                        <button
                          key={style}
                          type="button"
                          className={cn(
                            "group relative h-auto p-4 rounded-lg border-2 transition-all duration-300 text-left",
                            formData.emailStyle === style 
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                              : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          )}
                          onClick={() => handleInputChange('emailStyle', style)}
                        >
                          <div className="space-y-1">
                            <span className={cn(
                              "text-lg font-medium block",
                              formData.emailStyle === style ? "text-primary" : ""
                            )}>
                              {style}
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              {STYLE_DESCRIPTIONS[style]}
                            </span>
                          </div>
                          {formData.emailStyle === style && (
                            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between py-4 px-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="rounded-lg gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={generateEmailTemplate} 
                          disabled={isGenerating}
                          className="rounded-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Generate Template
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Creating Your Template</DialogTitle>
                          <DialogDescription>
                            Our AI is crafting your perfect email template...
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                          <div className="relative pt-1">
                            <Progress 
                              value={generationProgress} 
                              className="h-2 w-full rounded-full"
                            />
                            <span className="absolute right-0 top-3 text-xs text-muted-foreground">
                              {generationProgress}%
                            </span>
                          </div>
                          <div className="flex items-center justify-center">
                            {generationProgress < 100 ? (
                              <div className="flex items-center gap-2 text-primary">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Generating your template...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                                <Sparkles className="h-5 w-5" />
                                <span>Template ready!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <Card className="w-full">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                          <CardTitle>Template Editor</CardTitle>
                          <CardDescription>Edit your AI-generated email template</CardDescription>
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
                        />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Template Actions</CardTitle>
                        <CardDescription>Save, export, or preview your template</CardDescription>
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
                          onClick={() => {
                            if (!jsonData) {
                              toast({
                                title: 'No Template',
                                description: 'No template data available to load.',
                                variant: 'destructive'
                              });
                              return;
                            }

                            if (emailEditorRef.current?.editor) {
                              try {
                                const design = JSON.parse(jsonData);
                                emailEditorRef.current.editor.loadDesign(design);
                                toast({
                                  title: 'Success',
                                  description: 'Template loaded successfully.',
                                });
                              } catch (error) {
                                console.error('Error loading template:', error);
                                toast({
                                  title: 'Error',
                                  description: 'Failed to load template. Please try again.',
                                  variant: 'destructive'
                                });
                              }
                            } else {
                              toast({
                                title: 'Editor Not Ready',
                                description: 'Please wait for the editor to load.',
                                variant: 'destructive'
                              });
                            }
                          }}
                          disabled={!jsonData}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Load Template
                        </Button>
                        <Button className="w-full" variant="outline" onClick={exportHtml}>
                          <Download className="mr-2 h-4 w-4" />
                          Export HTML
                        </Button>
                        <Button className="w-full" variant="outline" onClick={togglePreview}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modals */}
        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Preview Mode</DialogTitle>
              <DialogDescription>
                You are now in preview mode. Click Edit to return to the editor.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => {
                togglePreview();
                setShowPreviewModal(false);
              }}>
                Return to Editor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Template</DialogTitle>
              <DialogDescription>
                Your template will be exported as an HTML file.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-3 text-sm">
                <p>This will export your email template as a standalone HTML file that can be used with most email marketing platforms.</p>
                <p className="mt-2">The exported file will include all styles and images needed for your template.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button onClick={exportHtml}>
                Export HTML
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
