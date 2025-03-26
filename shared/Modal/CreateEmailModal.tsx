import React from 'react';
import { useRouter } from 'next/navigation';
import { HelpingHand, BrainIcon, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateButton } from '../buttons/CreateButton';

export function CreateEmailModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <CreateButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">Choose an email type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <EmailOption
            icon={HelpingHand}
            title="Manual Crafting"
            description="Create personalized emails with a hands-on approach"
            actionText="Start Writing"
            path='/dashboard/templates/all'
          />
          <EmailOption
            icon={BrainIcon}
            title="AI-Assisted"
            description="Draft emails quickly with AI-powered suggestions"
            actionText="Coming Soon"
            path=''
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EmailOptionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionText: string;
  path: string;
}

function EmailOption({ icon: Icon, title, description, actionText, path }: EmailOptionProps) {
  const router = useRouter();

  const handleClick = () => {
    if (title !== "AI-Assisted" && path) {
      router.push(path);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 text-center bg-secondary rounded-lg transition-all hover:bg-secondary/80">
      <Icon className="w-12 h-12 text-primary" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button
        variant="outline"
        className="w-full mt-2 group"
        disabled={title === "AI-Assisted"}
        onClick={handleClick}
      >
        {actionText}
        {title !== "AI-Assisted" && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
      </Button>
    </div>
  );
}

