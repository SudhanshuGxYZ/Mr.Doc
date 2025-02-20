import React from 'react';

interface CopyMessageMenuProps {
  message: string;
  onCopy: () => void;
}

const CopyMessageMenu: React.FC<CopyMessageMenuProps> = ({ message, onCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(onCopy);
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
      <button
        onClick={handleCopy}
        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
      >
        Copy
      </button>
      {/* Add more menu options here */}
    </div>
  );
};

export default CopyMessageMenu;
