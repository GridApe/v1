// 'use client';

// import { useState, useRef, useCallback, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Toast } from '@/components/ui/toast';
// import {
//   Loader2,
//   Save,
//   Eye,
//   Upload,
//   Download,
//   Undo,
//   Redo,
//   Variable,
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useTemplateStore } from '@/store/templateStore';
// import { useRouter } from 'next/navigation';

// export default function EmailTemplateEditor() {
//   const emailEditorRef = useRef<EditorRef | null>(null);
//   const [templateName, setTemplateName] = useState<string>('');
//   const [previewMode, setPreviewMode] = useState<boolean>(false);
//   const [jsonData, setJsonData] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [canUndo, setCanUndo] = useState<boolean>(false);
//   const [canRedo, setCanRedo] = useState<boolean>(false);
//   const [showVariableDialog, setShowVariableDialog] = useState<boolean>(false);
//   const [variableName, setVariableName] = useState<string>('');
//   const [variableDescription, setVariableDescription] = useState<string>('');
//   const [variables, setVariables] = useState<{ name: string; description: string }[]>([]);
//   const router = useRouter();
//   const { toast } = useToast();
//   const { saveTemplate } = useTemplateStore();

//   const onReady: EmailEditorProps['onReady'] = useCallback(
//     (unlayer: any) => {
//       setIsLoading(false);
//       unlayer.addEventListener('design:updated', () => {
//         setCanUndo(unlayer.isUndoable());
//         setCanRedo(unlayer.isRedoable());
//       });

//       // Register custom variable tool
//       unlayer.registerTool({
//         name: 'variable',
//         label: 'Variable',
//         icon: 'fa-tag',
//         supportedDisplayModes: ['web', 'email'],
//         options: {
//           default: {
//             title: null,
//           },
//           text: {
//             title: 'Text',
//             position: 1,
//             options: {
//               variable: {
//                 label: 'Variable',
//                 defaultValue: '',
//                 widget: 'dropdown',
//                 data: {
//                   options: variables.map((v) => ({
//                     value: `{{${v.name}}}`,
//                     label: v.name,
//                   })),
//                 },
//               },
//             },
//           },
//         },
//         values: {},
//         renderer: {
//           Viewer: (props: any) => {
//             return <span>{props.values.variable}</span>;
//           },
//           Export: (props: any) => {
//             return <span>{props.values.variable}</span>;
//           },
//         },
//       });
//     },
//     [variables]
//   );

//   const saveDesign = useCallback(() => {
//     emailEditorRef.current?.editor?.saveDesign((design: any) => {
//       setJsonData(JSON.stringify(design));
//       saveTemplate({
//         name: templateName,
//         content: jsonData,
//       })
//         .then(() => {
//           toast({
//             title: 'Design Saved',
//             description: 'Your email template design has been saved.',
//           });
//           router.push('/dashboard/templates/saved');
//         })
//         .catch(() => {
//           toast({
//             title: 'Error',
//             description: 'Failed to save template. Please try again later.',
//             variant: 'destructive',
//           });
//         });
//     });
//   }, [toast, saveTemplate, templateName]);

//   const exportHtml = useCallback(() => {
//     emailEditorRef.current?.editor?.exportHtml((data) => {
//       const { html } = data;
//       console.log('HTML Output:', html);
//       const blob = new Blob([html], { type: 'text/html' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${templateName || 'email-template'}.html`;
//       a.click();
//       URL.revokeObjectURL(url);
//       toast({
//         title: 'Template Exported',
//         description: 'Your email template has been exported as HTML.',
//       });
//     });
//   }, [templateName, toast]);

//   const togglePreview = useCallback(() => {
//     if (previewMode) {
//       emailEditorRef.current?.editor?.hidePreview();
//     } else {
//       emailEditorRef.current?.editor?.showPreview('desktop');
//     }
//     setPreviewMode((prev) => !prev);
//   }, [previewMode]);

//   const loadDesign = useCallback(() => {
//     try {
//       const design = JSON.parse(jsonData);
//       emailEditorRef.current?.editor?.loadDesign(design);
//       toast({
//         title: 'Design Loaded',
//         description: 'Your email template design has been loaded.',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: `Failed to load design. Please check your JSON data. ${error}`,
//         variant: 'destructive',
//       });
//     }
//   }, [jsonData, toast]);

//   const undoAction = useCallback(() => {
//     emailEditorRef.current?.editor?.undo();
//   }, []);

//   const redoAction = useCallback(() => {
//     emailEditorRef.current?.editor?.redo();
//   }, []);

//   const handleImageUpload = useCallback(
//     (file: File, onSuccess: (url: string) => void) => {
//       // Here you would typically upload the file to your server or a file storage service
//       // For this example, we'll create a local object URL
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const dataUrl = e.target?.result as string;
//         onSuccess(dataUrl);
//         toast({
//           title: 'Image Uploaded',
//           description: 'Your image has been successfully uploaded.',
//         });
//       };
//       reader.readAsDataURL(file);
//     },
//     [toast]
//   );

//   const addVariable = useCallback(() => {
//     if (variableName) {
//       setVariables((prev) => [...prev, { name: variableName, description: variableDescription }]);
//       setVariableName('');
//       setVariableDescription('');
//       setShowVariableDialog(false);
//       toast({
//         title: 'Variable Added',
//         description: `Variable {{${variableName}}} has been added to the template.`,
//       });
//     }
//   }, [variableName, variableDescription, toast]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) {
//         if (e.key === 'z') {
//           e.preventDefault();
//           undoAction();
//         } else if (e.key === 'y') {
//           e.preventDefault();
//           redoAction();
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [undoAction, redoAction]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="space-y-6 p-4 md:p-6 lg:p-8"
//     >
//       <h1 className="text-2xl md:text-3xl font-bold">Email Template Editor</h1>
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle>Template Editor</CardTitle>
//           <CardDescription>Create your email template using drag and drop</CardDescription>
//         </CardHeader>
//         <CardContent className="relative min-h-[500px]">
//           <AnimatePresence>
//             {isLoading && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
//               >
//                 <Loader2 className="h-8 w-8 animate-spin" />
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <EmailEditor
//             ref={emailEditorRef}
//             onReady={onReady}
//             minHeight={500}
//             style={{ width: '100%' }}
//             options={{
//               appearance: {
//                 theme: 'dark',
//               },
//               features: {
//                 stockImages: true,
//               },
//               tools: {
//                 button: {
//                   enabled: true,
//                 },
//                 text: {
//                   enabled: true,
//                 },
//                 variable: {
//                   enabled: true,
//                 },
//               },
//               customJS: [
//                 `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js`,
//               ],
//             }}
//             projectId={1} // Replace with your actual Unlayer project ID
//             onLoad={() => {
//               emailEditorRef.current?.editor?.addEventListener(
//                 'image:added',
//                 (file: File, done: (arg0: { progress: number; url: string }) => void) => {
//                   if (file) {
//                     handleImageUpload(file, (url) => {
//                       done({ progress: 100, url });
//                     });
//                   }
//                 }
//               );
//             }}
//           />
//         </CardContent>
//         <CardFooter className="flex flex-wrap justify-between gap-2">
//           <div className="flex flex-wrap gap-2">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline">
//                   <Save className="mr-2 h-4 w-4" /> Save Template
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Save Template</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="name" className="text-right">
//                       Name
//                     </Label>
//                     <Input
//                       id="name"
//                       value={templateName}
//                       onChange={(e) => setTemplateName(e.target.value)}
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button onClick={saveDesign}>Save Design</Button>
//                   <Button onClick={exportHtml}>Export HTML</Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//             <Button onClick={togglePreview}>
//               <Eye className="mr-2 h-4 w-4" /> {previewMode ? 'Edit' : 'Preview'}
//             </Button>
//             <Button onClick={undoAction} disabled={!canUndo}>
//               <Undo className="mr-2 h-4 w-4" /> Undo
//             </Button>
//             <Button onClick={redoAction} disabled={!canRedo}>
//               <Redo className="mr-2 h-4 w-4" /> Redo
//             </Button>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button variant="outline">
//                   <Upload className="mr-2 h-4 w-4" /> Load Design
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Load Design</DialogTitle>
//                 </DialogHeader>
//                 <Textarea
//                   value={jsonData}
//                   onChange={(e) => setJsonData(e.target.value)}
//                   placeholder="Paste your JSON design data here"
//                   className="min-h-[200px]"
//                 />
//                 <Button onClick={loadDesign}>Load Design</Button>
//               </DialogContent>
//             </Dialog>
//             <Button onClick={exportHtml}>
//               <Download className="mr-2 h-4 w-4" /> Export HTML
//             </Button>
//             <Dialog open={showVariableDialog} onOpenChange={setShowVariableDialog}>
//               <DialogTrigger asChild>
//                 <Button variant="outline">
//                   <Variable className="mr-2 h-4 w-4" /> Add Variable
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Add Variable</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="variableName" className="text-right">
//                       Name
//                     </Label>
//                     <Input
//                       id="variableName"
//                       value={variableName}
//                       onChange={(e) => setVariableName(e.target.value)}
//                       className="col-span-3"
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="variableDescription" className="text-right">
//                       Description
//                     </Label>
//                     <Input
//                       id="variableDescription"
//                       value={variableDescription}
//                       onChange={(e) => setVariableDescription(e.target.value)}
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <Button onClick={addVariable}>Add Variable</Button>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardFooter>
//       </Card>
//       <Card>
//         <CardHeader>
//           <CardTitle>Variable Usage</CardTitle>
//           <CardDescription>How to use variables in your template</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p>To use variables in your template, follow these steps:</p>
//           <ol className="list-decimal list-inside space-y-2 mt-2">
//             <li>Click the "Add Variable" button to define a new variable.</li>
//             <li>In the editor, use the Variable tool to insert variables into your content.</li>
//             <li>Variables will appear in the format {'{{variableName}}'} in your template.</li>
//             <li>When sending emails, replace these variables with actual values.</li>
//           </ol>
//           <div className="mt-4">
//             <h4 className="font-semibold">Available Variables:</h4>
//             <ul className="list-disc list-inside mt-2">
//               {variables.map((variable, index) => (
//                 <li key={index}>
//                   <code>{`{{${variable.name}}}`}</code> - {variable.description}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </CardContent>
//       </Card>
//       <Toast />
//     </motion.div>
//   );
// }

import React from 'react';

const page = () => {
  return <div>page</div>;
};

export default page;
