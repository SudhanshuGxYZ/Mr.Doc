import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-fade-in-up">
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;