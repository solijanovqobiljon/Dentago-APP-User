import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const Lenguage = () => {
  const navigate = useNavigate();
  // Standart tanlangan til - Rus tili (rasmdagidek)
  const [selectedLang, setSelectedLang] = useState('ru');

  const languages = [
    { id: 'uz', name: "O'zbek tili" },
    { id: 'ru', name: "Русский" },
    { id: 'en', name: "English" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans text-gray-800">
      
      {/* Header */}
      <div className="w-full max-w-2xl bg-white flex items-center p-4 relative border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 p-1 active:scale-90 transition-transform"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="w-full text-center text-xl font-bold">Язык</h1>
      </div>

      {/* Tillar ro'yxati kartasi */}
      <div className="w-[92%] max-w-2xl mt-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {languages.map((lang, index) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`w-full flex items-center justify-between p-5 text-lg font-medium transition-colors active:bg-gray-50 ${
                index !== languages.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span className={selectedLang === lang.id ? 'text-gray-900' : 'text-gray-600'}>
                {lang.name}
              </span>
              
              {selectedLang === lang.id && (
                <div className="text-blue-500">
                  <CheckCircle2 size={24} fill="currentColor" className="text-white fill-blue-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Lenguage;