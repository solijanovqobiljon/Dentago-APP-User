import React from 'react';
import { Globe, Instagram, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Navigate qo'shildi
import logoo from '../assets/logoo.png';

const Haqida = () => {
  const navigate = useNavigate(); // 2. Funksiyani chaqiramiz

  const handleGoBack = () => {
    navigate(-1); // 3. Orqaga qaytish funksiyasi
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans text-gray-800">
      
      {/* Header / Navigatsiya */}
      {/* max-w-2xl qo'shildi, kompyuterda ham juda yoyilib ketmasligi uchun */}
      <div className="w-full max-w-2xl flex items-center p-4 relative">
        <button 
          onClick={handleGoBack} // 4. Bosilganda ishlash
          className="absolute left-4 p-1 hover:bg-gray-200 rounded-full transition-colors active:scale-95"
          aria-label="Back"
        >
          <ChevronLeft size={30} strokeWidth={2.5} />
        </button>
        <h1 className="w-full text-center text-xl font-bold">О компании</h1>
      </div>

      {/* Logo va Versiya */}
      <div className="flex flex-col items-center mt-8 mb-6">
        <div className="w-20 h-20 bg-cyan-400 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          <img src={logoo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Denta <span className="text-cyan-500">Go</span>
        </h2>
        <p className="text-gray-400 mt-1 font-medium text-lg">Версия 1.0.0</p>
      </div>

      {/* Kontent qismi */}
      <div className="w-full max-w-2xl px-4 space-y-4"> {/* max-w-2xl kompyuter uchun qulay */}
        
        {/* Nash servis bloki */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-3 text-gray-900">Наш сервис</h3>
          <p className="text-gray-500 leading-relaxed text-base">
            Мы стремимся сделать онлайн-покупки удобными и доступными для каждого. 
            Наша платформа предлагает широкий ассортимент товаров, быструю доставку и 
            высокий уровень обслуживания.
          </p>
        </div>

        {/* Svyazatsya bloki */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-5 text-gray-900">Связаться с нами</h3>
          
          <div className="space-y-5">
            <a href="https://example.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-blue-500 font-medium text-lg hover:opacity-80">
              <div className="bg-blue-100 p-1.5 rounded-md">
                <Globe size={22} />
              </div>
              Перейти на веб-сайт
            </a>
            
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-blue-500 font-medium text-lg hover:opacity-80">
              <div className="bg-blue-100 p-1.5 rounded-md">
                <Instagram size={22} />
              </div>
              Мы в Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto mb-8 pt-10">
        <p className="text-gray-400 text-sm">
          © 2025 DentaGo. Все права защищены.
        </p>
      </div>
    </div>
  );
};

export default Haqida;