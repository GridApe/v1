'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Copy, Eye, Code, Check, PlusCircle, Trash2, Smartphone, Monitor } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import SearchBar from '@/shared/SearchBar';
import { mockSearchFunction } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface WidgetSettings {
    id?: string;
    name: string;
    title: string;
    description: string;
    buttonText: string;
    position: string;
    delay: number;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    successMessage: string;
    showNameField: boolean;
    showPrivacyPolicy: boolean;
    privacyPolicyText: string;
    privacyPolicyLink: string;
    animation: string;
    formType: string;
    borderRadius: number;
    fontFamily: string;
    createdAt?: string;
    updatedAt?: string;
}

interface WidgetStats {
    id: string;
    views: number;
    submissions: number;
    conversionRate: number;
}

const defaultSettings: WidgetSettings = {
    name: 'My Email Widget',
    title: 'Subscribe to our newsletter',
    description: 'Get the latest updates straight to your inbox',
    buttonText: 'Subscribe',
    position: 'bottom-right',
    delay: 2,
    primaryColor: '#2E3192',
    secondaryColor: '#ffffff',
    textColor: '#ffffff',
    successMessage: 'Thank you for subscribing!',
    showNameField: false,
    showPrivacyPolicy: true,
    privacyPolicyText: 'By subscribing, you agree to our privacy policy',
    privacyPolicyLink: '/privacy',
    animation: 'slide',
    formType: 'popup',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif'
};

const mockWidgets = [
    {
        id: '1',
        name: 'Website Footer Form',
        formType: 'inline',
        createdAt: '2025-03-01T12:00:00Z',
        updatedAt: '2025-03-10T14:30:00Z'
    },
    {
        id: '2',
        name: 'Blog Pop-up',
        formType: 'popup',
        createdAt: '2025-02-15T10:20:00Z',
        updatedAt: '2025-03-12T09:45:00Z'
    }
];

const mockStats: Record<string, WidgetStats> = {
    '1': {
        id: '1',
        views: 1247,
        submissions: 342,
        conversionRate: 27.4
    },
    '2': {
        id: '2',
        views: 874,
        submissions: 198,
        conversionRate: 22.7
    }
};

const WidgetBuilder = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('design');
    const [settings, setSettings] = useState<WidgetSettings>(defaultSettings);
    const [widgets, setWidgets] = useState(mockWidgets);
    const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [embedCode, setEmbedCode] = useState('');

    useEffect(() => {
        // Generate embed code when settings change
        const userId = user?.id || 'USER_ID';
        const code = `<script src="https://your-domain.com/widget.js" data-widget-id="${selectedWidget || 'new'}" data-user-id="${userId}" async></script>`;
        setEmbedCode(code);
    }, [settings, selectedWidget, user]);

    useEffect(() => {
        if (selectedWidget) {
            // Fetch widget settings from server
            setLoading(true);
            // Mock API call
            setTimeout(() => {
                setSettings({
                    ...defaultSettings,
                    name: widgets.find(w => w.id === selectedWidget)?.name || defaultSettings.name,
                    formType: widgets.find(w => w.id === selectedWidget)?.formType || defaultSettings.formType
                });
                setLoading(false);
            }, 600);
        } else {
            setSettings(defaultSettings);
        }
    }, [selectedWidget]);

    const handleSettingsChange = (key: keyof WidgetSettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);

        // Mock API call
        setTimeout(() => {
            if (selectedWidget) {
                // Update existing widget
                setWidgets(prev =>
                    prev.map(w =>
                        w.id === selectedWidget
                            ? { ...w, name: settings.name, formType: settings.formType, updatedAt: new Date().toISOString() }
                            : w
                    )
                );
                toast({
                    title: "Widget updated",
                    description: "Your widget has been successfully updated.",
                    duration: 3000
                });
            } else {
                // Create new widget
                const newWidget = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: settings.name,
                    formType: settings.formType,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                setWidgets(prev => [...prev, newWidget]);
                setSelectedWidget(newWidget.id);
                toast({
                    title: "Widget created",
                    description: "Your new widget has been created.",
                    duration: 3000
                });
            }
            setIsSaving(false);
        }, 800);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Code copied",
            description: "Embed code has been copied to clipboard.",
            duration: 3000
        });
    };

    const handleCreateNew = () => {
        setSelectedWidget(null);
        setSettings(defaultSettings);
        setActiveTab('design');
    };

    const handleDeleteWidget = (id: string) => {
        setWidgets(prev => prev.filter(w => w.id !== id));
        if (selectedWidget === id) {
            setSelectedWidget(null);
            setSettings(defaultSettings);
        }
        toast({
            title: "Widget deleted",
            description: "Your widget has been deleted.",
            duration: 3000
        });
    };

    const renderWidgetPreview = () => {
        const getPositionClass = () => {
            switch (settings.position) {
                case 'bottom-right': return 'bottom-4 right-4';
                case 'bottom-left': return 'bottom-4 left-4';
                case 'top-right': return 'top-4 right-4';
                case 'top-left': return 'top-4 left-4';
                case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
                default: return 'bottom-4 right-4';
            }
        };

        if (settings.formType === 'popup') {
            return (
                <div className={`${previewMode === 'mobile' ? 'w-64' : 'w-80'} relative mx-auto bg-gray-100 ${previewMode === 'mobile' ? 'h-96' : 'h-96'} rounded-lg overflow-hidden border border-gray-200`}>
                    <div className="w-full h-6 bg-gray-200 flex items-center px-2">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div className="p-2 h-full relative">
                        <div className={`absolute ${getPositionClass()} shadow-md`} style={{ borderRadius: `${settings.borderRadius}px` }}>
                            <div
                                className="overflow-hidden"
                                style={{
                                    backgroundColor: settings.primaryColor,
                                    borderRadius: `${settings.borderRadius}px`
                                }}
                            >
                                <div className="p-4">
                                    <h3
                                        className="text-lg font-semibold"
                                        style={{ color: settings.textColor }}
                                    >
                                        {settings.title}
                                    </h3>
                                    <p
                                        className="text-sm mt-1"
                                        style={{ color: settings.textColor }}
                                    >
                                        {settings.description}
                                    </p>
                                </div>
                                <div className="p-4 bg-white">
                                    {settings.showNameField && (
                                        <div className="mb-2">
                                            <Input
                                                type="text"
                                                placeholder="Your name"
                                                className="w-full text-sm"
                                            />
                                        </div>
                                    )}
                                    <div className="mb-2">
                                        <Input
                                            type="email"
                                            placeholder="Your email"
                                            className="w-full text-sm"
                                        />
                                    </div>
                                    <Button
                                        className="w-full mt-2 text-sm"
                                        style={{
                                            backgroundColor: settings.primaryColor,
                                            color: settings.textColor
                                        }}
                                    >
                                        {settings.buttonText}
                                    </Button>

                                    {settings.showPrivacyPolicy && (
                                        <p className="text-xs mt-2 text-gray-500">
                                            {settings.privacyPolicyText}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Inline form preview
            return (
                <div className={`${previewMode === 'mobile' ? 'w-64' : 'w-full'} mx-auto bg-gray-100 ${previewMode === 'mobile' ? 'h-96' : 'h-96'} rounded-lg overflow-hidden border border-gray-200`}>
                    <div className="w-full h-6 bg-gray-200 flex items-center px-2">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div className="p-4 h-full">
                        <div className="mt-4 p-4 bg-gray-200 rounded-md"></div>
                        <div className="mt-4 p-2 bg-gray-200 rounded-md"></div>
                        <div className="mt-4 p-10 bg-gray-200 rounded-md"></div>

                        <div
                            className="mt-4 p-4 flex flex-col sm:flex-row gap-4"
                            style={{
                                backgroundColor: settings.primaryColor,
                                borderRadius: `${settings.borderRadius}px`
                            }}
                        >
                            <div className="flex-1">
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: settings.textColor }}
                                >
                                    {settings.title}
                                </h3>
                                <p
                                    className="text-sm mt-1"
                                    style={{ color: settings.textColor }}
                                >
                                    {settings.description}
                                </p>
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full"
                                />
                                <Button
                                    className="whitespace-nowrap"
                                    style={{
                                        backgroundColor: settings.secondaryColor,
                                        color: settings.primaryColor
                                    }}
                                >
                                    {settings.buttonText}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 rounded-lg">
            <div className="mb-5">
                <SearchBar
                    searchFunction={mockSearchFunction}
                    avatarSrc={user?.avatar}
                    avatarFallback={user?.first_name}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Widgets Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Email Widgets</CardTitle>
                                <CardDescription>Collect subscribers from your website</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start p-4 text-[#2E3192] rounded-none border-b"
                                    onClick={handleCreateNew}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create new widget
                                </Button>
                                <div className="max-h-64 overflow-y-auto">
                                    {widgets.map((widget) => (
                                        <div
                                            key={widget.id}
                                            className={`p-4 border-b cursor-pointer transition-colors ${selectedWidget === widget.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                            onClick={() => setSelectedWidget(widget.id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-sm">{widget.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {widget.formType === 'popup' ? 'Pop-up' : 'Inline'}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(widget.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteWidget(widget.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </div>

                                            {mockStats[widget.id] && (
                                                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                                                    <div>
                                                        <div className="font-medium">{mockStats[widget.id].views.toLocaleString()}</div>
                                                        <div>Views</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{mockStats[widget.id].submissions.toLocaleString()}</div>
                                                        <div>Submissions</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{mockStats[widget.id].conversionRate}%</div>
                                                        <div>Conversion</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>
                                        {selectedWidget ? 'Edit Widget' : 'Create New Widget'}
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedWidget ? 'Modify your existing widget' : 'Configure a new email subscription widget'}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewMode('mobile')}
                                        className={previewMode === 'mobile' ? 'bg-blue-50' : ''}
                                    >
                                        <Smartphone className="h-4 w-4 mr-1" />
                                        Mobile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewMode('desktop')}
                                        className={previewMode === 'desktop' ? 'bg-blue-50' : ''}
                                    >
                                        <Monitor className="h-4 w-4 mr-1" />
                                        Desktop
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {loading ? (
                                    <div className="flex flex-col gap-4">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-40 w-full" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col-reverse lg:flex-row gap-6">
                                        {/* Settings Panel */}
                                        <div className="w-full lg:w-1/2">
                                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                                <TabsList className="grid grid-cols-2 w-full">
                                                    <TabsTrigger value="design">Design</TabsTrigger>
                                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="design" className="space-y-4 mt-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Widget Name (Internal)</Label>
                                                        <Input
                                                            id="name"
                                                            value={settings.name}
                                                            onChange={(e) => handleSettingsChange('name', e.target.value)}
                                                        />
                                                        <p className="text-xs text-gray-500">For your reference only, not shown to visitors</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">Title</Label>
                                                        <Input
                                                            id="title"
                                                            value={settings.title}
                                                            onChange={(e) => handleSettingsChange('title', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="description">Description</Label>
                                                        <Textarea
                                                            id="description"
                                                            value={settings.description}
                                                            onChange={(e) => handleSettingsChange('description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="buttonText">Button Text</Label>
                                                        <Input
                                                            id="buttonText"
                                                            value={settings.buttonText}
                                                            onChange={(e) => handleSettingsChange('buttonText', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="formType">Form Type</Label>
                                                        <Select
                                                            value={settings.formType}
                                                            onValueChange={(value) => handleSettingsChange('formType', value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select form type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="popup">Pop-up</SelectItem>
                                                                <SelectItem value="inline">Inline</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {settings.formType === 'popup' && (
                                                        <div className="space-y-2">
                                                            <Label htmlFor="position">Position</Label>
                                                            <Select
                                                                value={settings.position}
                                                                onValueChange={(value) => handleSettingsChange('position', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select position" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                                                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                                                    <SelectItem value="top-right">Top Right</SelectItem>
                                                                    <SelectItem value="top-left">Top Left</SelectItem>
                                                                    <SelectItem value="center">Center</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                                                </TabsContent>

                                                <TabsContent value="settings" className="space-y-4 mt-4">
                                                    <div className="space-y-2">
                                                        <Label>Colors</Label>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-xs mb-1">Primary Color</p>
                                                                <div className="flex">
                                                                    <input
                                                                        type="color"
                                                                        value={settings.primaryColor}
                                                                        onChange={(e) => handleSettingsChange('primaryColor', e.target.value)}
                                                                        className="w-full h-10 rounded cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs mb-1">Secondary Color</p>
                                                                <div className="flex">
                                                                    <input
                                                                        type="color"
                                                                        value={settings.secondaryColor}
                                                                        onChange={(e) => handleSettingsChange('secondaryColor', e.target.value)}
                                                                        className="w-full h-10 rounded cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs mb-1">Text Color</p>
                                                                <div className="flex">
                                                                    <input
                                                                        type="color"
                                                                        value={settings.textColor}
                                                                        onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                                                                        className="w-full h-10 rounded cursor-pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="delay">Display Delay (seconds)</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                // id="delay"
                                                                min={0}
                                                                max={10}
                                                                step={1}
                                                                value={[settings.delay]}
                                                                onValueChange={([value]) => handleSettingsChange('delay', value)}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-8 text-center">{settings.delay}s</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="borderRadius">Border Radius</Label>
                                                        <div className="flex items-center gap-4">
                                                            <Slider
                                                                // id="borderRadius"
                                                                min={0}
                                                                max={24}
                                                                step={1}
                                                                value={[settings.borderRadius]}
                                                                onValueChange={([value]) => handleSettingsChange('borderRadius', value)}
                                                                className="flex-1"
                                                            />
                                                            <span className="w-10 text-center">{settings.borderRadius}px</span>
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="showNameField">Show Name Field</Label>
                                                            <Switch
                                                                id="showNameField"
                                                                checked={settings.showNameField}
                                                                onCheckedChange={(value) => handleSettingsChange('showNameField', value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="showPrivacyPolicy">Show Privacy Policy</Label>
                                                            <Switch
                                                                id="showPrivacyPolicy"
                                                                checked={settings.showPrivacyPolicy}
                                                                onCheckedChange={(value) => handleSettingsChange('showPrivacyPolicy', value)}
                                                            />
                                                        </div>

                                                        {settings.showPrivacyPolicy && (
                                                            <>
                                                                <Input
                                                                    value={settings.privacyPolicyText}
                                                                    onChange={(e) => handleSettingsChange('privacyPolicyText', e.target.value)}
                                                                    placeholder="Privacy policy text"
                                                                    className="mt-2"
                                                                />
                                                                <Input
                                                                    value={settings.privacyPolicyLink}
                                                                    onChange={(e) => handleSettingsChange('privacyPolicyLink', e.target.value)}
                                                                    placeholder="/privacy-policy"
                                                                    className="mt-2"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </div>

                                        {/* Preview Panel */}
                                        <div className="w-full lg:w-1/2">
                                            <div className="bg-white rounded-lg border p-4 h-full">
                                                <h3 className="text-sm font-medium mb-4 text-center">Widget Preview</h3>
                                                {renderWidgetPreview()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="w-full sm:w-auto order-2 sm:order-1">
                                    {selectedWidget && (
                                        <div className="border rounded p-2 bg-gray-50 flex items-center gap-2 text-sm">
                                            <Code className="w-4 h-4 text-gray-500" />
                                            <div className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs">
                                                {embedCode}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={handleCopyCode}
                                            >
                                                {copied ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    className="w-full sm:w-auto order-1 sm:order-2"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : selectedWidget ? 'Update Widget' : 'Create Widget'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WidgetBuilder;