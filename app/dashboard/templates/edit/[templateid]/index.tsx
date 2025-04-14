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
import { useCampaignStore } from '@/store/useCampaignStore';
import { Badge } from '@/components/ui/badge';

interface TemplateData {
    id: string;
    name: string;
    content: string;
    html: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    status: string;
    message: string;
    data: {
        template: TemplateData;
    };
}

export default function EmailTemplateEditor({getTemplateId}: { getTemplateId: string }) {
    const emailEditorRef = useRef<EditorRef | null>(null);
    const [templateName, setTemplateName] = useState<string>('');
    const [previewMode, setPreviewMode] = useState<boolean>(false);
    const [jsonData, setJsonData] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [canUndo, setCanUndo] = useState<boolean>(false);
    const [canRedo, setCanRedo] = useState<boolean>(false);
    const [showVariableDialog, setShowVariableDialog] = useState<boolean>(false);
    const [variableName, setVariableName] = useState<string>('');
    const [variableDescription, setVariableDescription] = useState<string>('');
    const [variables, setVariables] = useState<{ name: string; description: string }[]>([]);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const { setSelectedTemplateState, action, setAction } = useCampaignStore();

    // Fetch template data
    const fetchTemplate = async (templateId: string) => {
        try {
            const response = await fetch(`/api/user/templates/edit/${templateId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch template');
            }

            const data: ApiResponse = await response.json();

            if (data.status === 'success' && data.data.template) {
                const template = data.data.template;
                setTemplateName(template.name);
                setJsonData(template.content);

                if (emailEditorRef.current?.editor && template.content) {
                    try {
                        const designData = JSON.parse(template.content);
                        emailEditorRef.current?.editor?.loadDesign(designData);
                    } catch (error) {
                        // console.error('Error parsing template content:', error);
                        toast({
                            title: 'Error',
                            description: 'Failed to load template design.',
                            variant: 'destructive',
                        });
                    }
                }
            }
        } catch (error) {
            // console.error('Error fetching template:', error);
            toast({
                title: 'Error',
                description: 'Failed to load template. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Load template on component mount
    useEffect(() => {
        if (getTemplateId) {
            fetchTemplate(getTemplateId);
        }
    }, [getTemplateId]);

    // Save template
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
            // Validate the content is valid JSON
            try {
                JSON.parse(content); // Verify we can parse it
            } catch (error) {
                // console.error('Invalid JSON content:', error);
                return {
                    success: false,
                    message: 'Invalid template content format'
                };
            }

            const payload = {
                name,
                content,
                html,
            };

            // console.log('Sending payload:', payload);

            const response = await fetch(`/api/user/templates/update/${getTemplateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // console.error('API error response:', errorData);
                return {
                    success: false,
                    message: errorData.message || 'Failed to save template'
                };
            }

            const data = await response.json();
            setSelectedTemplateState('selected');
            setAction(null);
            router.push('/dashboard/campaign/create');
            return { success: true, message: 'Template saved successfully!' };
        } catch (error: any) {
            // console.error('Error saving template:', error);
            return {
                success: false,
                message: error.message || 'Something went wrong'
            };
        }
    };
    // Editor ready handler
    const onReady: EmailEditorProps['onReady'] = useCallback(
        (unlayer: any) => {
            setIsLoading(false);

            // Set up design update listener
            unlayer.addEventListener('design:updated', () => {
                setCanUndo(unlayer.isUndoable());
                setCanRedo(unlayer.isRedoable());
            });

            // Register variable tool
            unlayer.registerTool({
                name: 'variable',
                label: 'Variable',
                icon: 'fa-tag',
                supportedDisplayModes: ['web', 'email'],
                options: {
                    default: {
                        title: null,
                    },
                    text: {
                        title: 'Text',
                        position: 1,
                        options: {
                            variable: {
                                label: 'Variable',
                                defaultValue: '',
                                widget: 'dropdown',
                                data: {
                                    options: variables.map((v) => ({
                                        value: `{{${v.name}}}`,
                                        label: v.name,
                                    })),
                                },
                            },
                        },
                    },
                },
                values: {},
                renderer: {
                    Viewer: (props: any) => {
                        return <span>{props.values.variable}</span>;
                    },
                    Export: (props: any) => {
                        return <span>{props.values.variable}</span>;
                    },
                },
            });

            // Load design if available
            if (jsonData) {
                try {
                    const designData = JSON.parse(jsonData);
                    unlayer.loadDesign(designData);
                } catch (error) {
                    // console.error('Error loading design:', error);
                }
            }
        },
        [jsonData, variables]
    );

    // Save design
    const saveDesign = useCallback(() => {
        if (!templateName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a template name.',
                variant: 'destructive',
            });
            return;
        }

        emailEditorRef.current?.editor?.saveDesign((design: any) => {
            // Add debug logging
            // console.log('Raw design data:', design);

            try {
                const designJson = JSON.stringify(design);
                // console.log('Stringified design:', designJson);
                setJsonData(designJson);

                emailEditorRef.current?.editor?.exportHtml((data: { html: string }) => {
                    // console.log('HTML data:', data);

                    saveTemplate({
                        name: templateName,
                        content: designJson, // Using the stringified version directly
                        html: data.html,
                    })
                        .then((result) => {
                            // console.log('Save result:', result);
                            if (result.success) {
                                toast({
                                    title: 'Design Saved',
                                    description: 'Your email template design has been saved.',
                                });
                            } else {
                                throw new Error(result.message);
                            }
                        })
                        .catch((error) => {
                            // console.error('Save error:', error);
                            toast({
                                title: 'Error',
                                description: error.message || 'Failed to save template. Please try again later.',
                                variant: 'destructive',
                            });
                        });
                });
            } catch (error) {
                // console.error('JSON stringify error:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to process template data.',
                    variant: 'destructive',
                });
            }
        });
    }, [templateName, toast, router]);

    // Export HTML
    const exportHtml = useCallback(() => {
        emailEditorRef.current?.editor?.exportHtml((data) => {
            const { html } = data;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${templateName || 'email-template'}.html`;
            a.click();
            URL.revokeObjectURL(url);
            toast({
                title: 'Success',
                description: 'Template exported as HTML.',
            });
        });
    }, [templateName, toast]);

    // Toggle preview
    const togglePreview = useCallback(() => {
        if (previewMode) {
            emailEditorRef.current?.editor?.hidePreview();
        } else {
            emailEditorRef.current?.editor?.showPreview({ device: 'desktop' });
        }
        setPreviewMode((prev) => !prev);
    }, [previewMode]);

    // Load design
    const loadDesign = useCallback(() => {
        try {
            const design = JSON.parse(jsonData);
            emailEditorRef.current?.editor?.loadDesign(design);
            toast({
                title: 'Success',
                description: 'Design loaded successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load design. Please check your JSON data.',
                variant: 'destructive',
            });
        }
    }, [jsonData, toast]);

    // Undo/Redo actions
    const undoAction = useCallback(() => {
        emailEditorRef.current?.editor?.undo();
    }, []);

    const redoAction = useCallback(() => {
        emailEditorRef.current?.editor?.redo();
    }, []);

    // Handle image upload
    const handleImageUpload = useCallback(
        (file: File, onSuccess: (url: string) => void) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                onSuccess(dataUrl);
                toast({
                    title: 'Success',
                    description: 'Image uploaded successfully.',
                });
            };
            reader.readAsDataURL(file);
        },
        [toast]
    );

    // Add variable
    const addVariable = useCallback(() => {
        if (variableName) {
            setVariables((prev) => [...prev, { name: variableName, description: variableDescription }]);
            setVariableName('');
            setVariableDescription('');
            setShowVariableDialog(false);
            toast({
                title: 'Success',
                description: `Variable {{${variableName}}} added.`,
            });
        }
    }, [variableName, variableDescription, toast]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    undoAction();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    redoAction();
                } else if (e.key === 's') {
                    e.preventDefault();
                    saveDesign();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undoAction, redoAction, saveDesign]);

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
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Input
                                    id="name"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter template name"
                                />
                            </div>
                        </div>
                        {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Email Template</h1> */}
                    </div>
                    {/* <p className="text-muted-foreground">Edit your existing email template</p> */}
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
                                <CardDescription>Edit your email template using drag and drop</CardDescription>
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
                            <CardDescription>Save, preview, or export your template</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* <Dialog> */}
                            {/* <DialogTrigger asChild> */}
                            <Button className="w-full" variant="outline" onClick={saveDesign}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Template
                            </Button>
                            {/* </DialogTrigger> */}
                            {/* <DialogContent>
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
                </DialogContent> */}
                            {/* </Dialog> */}

                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={togglePreview}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                {previewMode ? 'Edit' : 'Preview'}
                            </Button>

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
        </motion.div>
    );
}
