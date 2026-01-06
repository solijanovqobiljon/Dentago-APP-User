import React from 'react';
import { ArrowLeft, Box, Tag, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    title: "Заказ № 12345 доставлен!",
    description: "Ваш заказ, содержащий ноутбук и мышь, доставлен. Приятных поку...",
    date: "25 августа, 14:30",
    icon: Box,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Скидка 30% на электронику!",
    description: "Не упустите шанс обновить свой гаджет с выгодой!",
    date: "24 августа, 10:00",
    icon: Tag,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
  },
  {
    id: 3,
    title: "Обновление приложения",
    description: "Мы обновили приложение, добавив новые функции и исправив ошибки.",
    date: "23 августа, 09:00",
    icon: RefreshCw,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
];

function Notification() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      {/* 1. Header */}
      <header className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800 cursor-pointer" />
        </button>
        <h1 className="flex-1 text-center text-[18px] font-bold text-gray-800 pr-8">
          Уведомления
        </h1>
      </header>

      {/* 2. Notifications List */}
      <main className="p-4 space-y-4 max-w-2xl mx-auto">
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-50 flex gap-4 transition-transform active:scale-[0.98]"
          >
            {/* Icon Container */}
            <div className={`w-12 h-12 ${item.iconBg} rounded-full flex items-center justify-center shrink-0`}>
              <item.icon className={item.iconColor} size={22} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-[16px] text-gray-900 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 text-[14px] leading-snug">
                {item.description}
              </p>
              <span className="text-gray-400 text-[13px] mt-1">
                {item.date}
              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Notification;