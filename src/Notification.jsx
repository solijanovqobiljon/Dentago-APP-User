import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // 4 soniya

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 left-1/2 z-[100] w-[90%] max-w-sm animate-bounce-in">
      <div className="bg-white border-l-4 border-blue-500 shadow-2xl rounded-2xl p-4 flex items-center gap-4">
        <div className="bg-blue-50 p-2 rounded-full">
          <FaCheckCircle className="text-blue-500" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">Tabriklayman!</h4>
          <p className="text-xs text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
