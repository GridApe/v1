import { Button } from '@/components/ui/button';
import {
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImagePlus,
  Link,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const EmailToolbar = () => {
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="flex items-center rounded-lg border bg-white shadow-sm p-1">
        <TooltipProvider>
          {[
            { icon: Type, label: 'Font' },
            { icon: Bold, label: 'Bold' },
            { icon: Italic, label: 'Italic' },
            { icon: Underline, label: 'Underline' },
            { icon: List, label: 'Bullet List' },
            { icon: ListOrdered, label: 'Numbered List' },
            { icon: AlignLeft, label: 'Align Left' },
            { icon: AlignCenter, label: 'Align Center' },
            { icon: AlignRight, label: 'Align Right' },
          ].map((tool) => (
            <Tooltip key={tool.label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tool.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <div className="flex items-center rounded-lg border bg-white shadow-sm p-1">
        <TooltipProvider>
          {[
            { icon: ImagePlus, label: 'Add Image' },
            { icon: Link, label: 'Add Link' },
          ].map((tool) => (
            <Tooltip key={tool.label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <tool.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tool.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
