import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RecipientListProps {
  recipients: string[];
  onRemove: (email: string) => void;
  maxVisible?: number;
}

export const RecipientList: React.FC<RecipientListProps> = ({ recipients, onRemove }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="ml-24 flex flex-wrap gap-2 items-center">
      {recipients.length > 1 ? (
        <>
          {/* Display only the first recipient */}
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
            <span>{recipients[0]}</span>
            <button onClick={() => onRemove(recipients[0])} className="hover:text-blue-900">
              ×
            </button>
          </div>

          {/* Show +X more button if there are more than one recipients */}
          {recipients.length > 1 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="text-blue-700 hover:underline text-sm">
                +{recipients.length - 1} more
              </DialogTrigger>
              <DialogContent
                className="max-w-[90vw] md:max-w-md p-4 "
                style={{ borderRadius: '8px' }}
              >
                <DialogHeader>
                  <DialogTitle>Recipients</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
                  {recipients.map((email) => (
                    <div
                      key={email}
                      className="flex justify-between items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-md"
                    >
                      <span className="truncate">{email}</span>
                      <button onClick={() => onRemove(email)} className="hover:text-blue-900">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      ) : (
        recipients.map((email) => (
          <div
            key={email}
            className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
          >
            <span>{email}</span>
            <button onClick={() => onRemove(email)} className="hover:text-blue-900">
              ×
            </button>
          </div>
        ))
      )}
    </div>
  );
};
