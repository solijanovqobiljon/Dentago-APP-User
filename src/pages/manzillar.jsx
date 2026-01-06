import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon } from 'lucide-react';

const Manzillar = () => {
  const navigate = useNavigate();
  // Faol tabni boshqarish (spisok yoki karta)
  const [activeTab, setActiveTab] = useState('spisok');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans text-gray-800">
      
      {/* Header qismi */}
      <div className="w-full max-w-2xl bg-white flex items-center p-4 relative border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 p-1 active:scale-90 transition-transform"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="w-full text-center text-xl font-bold">Локации</h1>
      </div>

      {/* Tab almashtirgich (Segmented Control) */}
      <div className="w-[92%] max-w-2xl mt-4 mb-4">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('spisok')}
            className={`flex-1 py-2 text-center font-bold rounded-lg transition-all ${
              activeTab === 'spisok' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-gray-50' 
              : 'text-gray-400'
            }`}
          >
            Список
          </button>
          <button
            onClick={() => setActiveTab('karta')}
            className={`flex-1 py-2 text-center font-bold rounded-lg transition-all ${
              activeTab === 'karta' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-gray-50' 
              : 'text-gray-400'
            }`}
          >
            Карта
          </button>
        </div>
      </div>

      {/* Kontent qismi */}
      <div className="w-full max-w-2xl px-4 flex-1">
        
        {activeTab === 'spisok' ? (
          /* --- Spisok ko'rinishi --- */
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Пункт выдачи №1
            </h3>
            <p className="text-gray-500 text-lg mb-2">
              Namangan shahar, Amir Temur ko'chasi 3 uy
            </p>
            <p className="text-gray-400 font-medium">
              Ежедневно: 9:00 - 20:00
            </p>
          </div>
        ) : (
          /* --- Karta ko'rinishi --- */
          <div className="flex flex-col items-center justify-center mt-32 text-center animate-in fade-in duration-300">
            <div className="mb-6 opacity-20">
              <MapIcon size={120} strokeWidth={1} color="#333" />
            </div>
            <p className="text-gray-500 text-xl font-medium max-w-[300px] leading-relaxed">
              Здесь будет отображаться карта с локациями.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Manzillar;