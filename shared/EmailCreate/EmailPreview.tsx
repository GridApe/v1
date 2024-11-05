import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmailPreviewProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
  recipients: string[];
  subject: string;
  emailContent: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  userName,
  userEmail,
  userAvatar,
  recipients,
  subject,
  emailContent,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <h2 className="font-semibold text-gray-900">Email Preview</h2>
        <div className="space-y-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>
                {userName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-sm text-gray-500">{userEmail}</div>
            </div>
          </div>
          {recipients.length > 0 && (
            <div className="text-sm text-gray-600">
              To: {recipients.join(", ")}
            </div>
          )}
          <div className="font-medium">{subject}</div>
        </div>
        <div className="prose prose-sm max-w-none">
          {emailContent || (
            <div className="text-gray-400 italic">
              Your email content will appear here as you type...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};