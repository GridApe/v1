interface RecipientListProps {
  recipients: string[];
  onRemove: (email: string) => void;
}

export const RecipientList: React.FC<RecipientListProps> = ({ recipients, onRemove }) => {
  return (
    <div className="ml-24 flex flex-wrap gap-2">
      {recipients.map((email) => (
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
    </div>
  );
};
