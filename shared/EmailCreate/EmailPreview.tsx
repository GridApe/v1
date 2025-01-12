import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useRef } from 'react';
import { TemplateTypes } from '@/types/interface';

interface EmailPreviewProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
  recipients: string[];
  subject: string;
  emailContent: TemplateTypes | null;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  userName,
  userEmail,
  userAvatar,
  recipients,
  subject,
  emailContent,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && emailContent) {
      const resizeIframe = () => {
        if (iframeRef.current) {
          iframeRef.current.style.height = `${iframeRef.current.contentWindow?.document.body?.scrollHeight || 240}px`;
        }
      };
      iframeRef.current.addEventListener('load', resizeIframe);
      return () => iframeRef.current?.removeEventListener('load', resizeIframe);
    }
  }, [emailContent]);

  return (
    <div className="rounded-lg bg-white pb-6 pt-2 shadow-sm">
      <div className="space-y-6">
        <div className="space-y-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>
                {userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-sm text-gray-500">{userEmail}</div>
            </div>
          </div>
          {recipients.length > 0 && (
            <div className="text-sm text-gray-600">To: {recipients.join(', ')}</div>
          )}
          <div className="font-medium">{subject}</div>
        </div>
        <div className="prose prose-sm max-w-none">
          <div className="aspect-[4/3] bg-gray-100">
            {emailContent ? (
              <iframe
                ref={iframeRef}
                srcDoc={emailContent.html}
                title={`Template Preview - ${emailContent.name}`}
                className="w-full h-full"
                sandbox="allow-same-origin allow-scripts allow-popups"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a template to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

