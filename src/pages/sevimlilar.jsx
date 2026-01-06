import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartOff } from 'lucide-react';

const Sevimlilar = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans">
      
      {/* Header qismi */}
      <div className="w-full max-w-2xl flex items-center p-4 relative border-b border-gray-50">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 p-1 active:scale-90 transition-transform"
        >
          <ArrowLeft size={28} color="#000" strokeWidth={2.5} />
        </button>
        <h1 className="w-full text-center text-xl font-bold text-black">
          Избранное
        </h1>
      </div>

      {/* Bo'sh holat (Empty State) */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Yurak belgisi (ustidan chizilgan) */}
        <div className="mb-6 opacity-20">
          <HeartOff size={100} strokeWidth={1} color="#333" />
        </div>

        {/* Asosiy matn */}
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Список избранного пуст
        </h2>

        {/* Qo'shimcha matn */}
        <p className="text-gray-400 text-base leading-tight max-w-[280px]">
          Добавляйте товары в избранное, чтобы они отображались здесь.
        </p>
      </div>

    </div>
  );
};

export default Sevimlilar;