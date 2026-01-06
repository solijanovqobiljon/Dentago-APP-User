import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalData = () => {
  const navigate = useNavigate();
  
  // Ma'lumotlarni localStorage'dan o'qish yoki default qiymatlarni o'rnatish
  const [formData, setFormData] = useState({
    name: localStorage.getItem('user_name') || 'Qobiljon',
    phone: localStorage.getItem('user_phone') || '+998932304637',
    birthday: localStorage.getItem('user_birthday') || '2025-12-19'
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Input o'zgarganda state'ni yangilash
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ma'lumotlarni saqlash funksiyasi
  const handleSave = () => {
    localStorage.setItem('user_name', formData.name);
    localStorage.setItem('user_phone', formData.phone);
    localStorage.setItem('user_birthday', formData.birthday);
    alert("Ma'lumotlar muvaffaqiyatli saqlandi!");
  };

  // Akkauntni o'chirish
  const handleDeleteAccount = () => {
    localStorage.clear(); // Barcha ma'lumotlarni tozalash
    setIsDeleteModalOpen(false);
    navigate('/register'); // Ro'yxatdan o'tish sahifasiga yo'naltirish
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      {/* Container */}
      <div className="w-full max-w-2xl bg-white min-h-screen md:min-h-0 md:my-10 md:rounded-3xl shadow-sm flex flex-col">
        
        {/* Header */}
        <div className="p-4 flex items-center border-b relative">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2 text-gray-800">
            Shaxsiy ma'lumotlar
          </h1>
        </div>

        {/* Form Section */}
        <div className="p-6 space-y-6 flex-1 md:px-12 md:py-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
            
            {/* Ism Input */}
            <div className="space-y-1">
              <label className="text-sm text-gray-400 ml-1">Ism</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium transition-all"
              />
            </div>

            {/* Telefon Input */}
            <div className="space-y-1">
              <label className="text-sm text-gray-400 ml-1">Telefon raqami</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium transition-all"
              />
            </div>

            {/* Tug'ilgan sana */}
            <div className="space-y-1">
              <label className="text-sm text-gray-400 ml-1">Tug'ilgan sana</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium transition-all"
              />
            </div>

            {/* Saqlash tugmasi */}
            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4"
            >
              O'zgarishlarni saqlash
            </button>
          </div>

          {/* Akkauntni o'chirish */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-500 font-bold hover:text-red-600 transition-colors p-2"
            >
              Akkauntni o'chirish
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-6">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-4 text-red-500">
              <Trash2 size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
              Hisobni o'chirish
            </h3>
            <p className="text-gray-500 text-center mb-8 px-2">
              Rostdan ham akkaunt ma'lumotlarini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
              >
                Yo'q
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-100 transition-all"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalData;