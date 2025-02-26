interface RecipientListProps {
  recipients: string[];
  onRemove: (email: string) => void;
  maxVisible?: number;
}

import React, { useState } from 'react';

export const RecipientList: React.FC<RecipientListProps> = ({ recipients, onRemove, maxVisible = 3 }) => {
  const [showAll, setShowAll] = React.useState(false);

  // Determine which recipients to show based on state
  const visibleRecipients = showAll
    ? recipients
    : recipients.slice(0, maxVisible);

  const remainingCount = recipients.length - maxVisible;

  // Toggle function to show/hide all recipients
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };
  return (
    <div className="ml-24 flex flex-wrap gap-2">
      {visibleRecipients.map((email) => (
        <div
          key={email}
          className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
        >
          <span>{email}</span>
          <button onClick={() => onRemove(email)} className="hover:text-blue-900">
            ×
          </button>
        </div>
      ))}

      {!showAll && remainingCount > 0 && (
        <button
          onClick={toggleShowAll}
          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-200 cursor-pointer"
        >
          +{remainingCount} {remainingCount === 1 ? 'other' : 'others'}
        </button>
      )}

      {showAll && recipients.length > maxVisible && (
        <button
          onClick={toggleShowAll}
          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-200 cursor-pointer"
        >
          Show less
        </button>
      )}
    </div>
  );
};
