import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();

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
        <h1 className="w-full text-center text-xl font-bold">Связаться с нами</h1>
      </div>

      {/* Asosiy karta */}
      <div className="w-[92%] max-w-2xl mt-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Служба поддержки
          </h2>
          <p className="text-gray-500 leading-snug mb-8 text-[17px]">
            Мы готовы ответить на все твои вопросы и помочь решить возникшие проблемы. 
            Выбери удобный способ связи.
          </p>

          {/* Aloqa yo'llari ro'yxati */}
          <div className="space-y-4">
            
            {/* Telefon */}
            <a 
              href="tel:+998772972222" 
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors"
            >
              <div className="text-blue-500">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Позвонить</h4>
                <p className="text-gray-400 font-medium">+998772972222</p>
              </div>
            </a>

            {/* Pochta */}
            <a 
              href="mailto:ddentago@gmail.com" 
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors"
            >
              <div className="text-blue-500">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Написать на почту</h4>
                <p className="text-gray-400 font-medium">ddentago@gmail.com</p>
              </div>
            </a>

            {/* Telegram */}
            <a 
              href="https://t.me/your_account" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors"
            >
              <div className="text-blue-500">
                <Send size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900">Написать в Telegram</h4>
                <p className="text-gray-400 font-medium">Наш аккаунт поддержки</p>
              </div>
            </a>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;