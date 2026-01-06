import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stomatologiyaKatalogi } from './MalumotlarStatik';
import { FaChevronRight, FaArrowLeft, FaSearch, FaBoxOpen } from 'react-icons/fa';
import logo from '../assets/logo.png';

const KichikKategoriyalar = () => {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const category = stomatologiyaKatalogi[categoryKey];

  // Kichik kategoriyalarni qidiruv bo'yicha filter qilish
  const filteredSubCategories = category?.subCategories.filter((sub) =>
    sub.nomi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Orqa fon uchun fixed div */}
      <div className="fixed inset-0 bg-[#08778E]"></div>

      {/* Asosiy kontent */}
      <div className="relative min-h-screen p-4 pb-32 pt-8 text-white">
        
        {/* Header qismi */}
        <div className="flex items-center mb-8 max-w-4xl mx-auto">
          <div 
            onClick={() => navigate('/kategoriyalar')} 
            className="p-3 bg-white/20 rounded-xl cursor-pointer hover:bg-white/30 transition-all"
          >
            <FaArrowLeft className="text-white text-xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold flex-1 text-center pr-10">
            {category?.sarlavha || "Kategoriyalar"}
          </h1>
        </div>

        {/* Logo qismi (Kategoriyalar sahifasidagidek kichikroq ko'rinishda) */}
        <div className="text-center mb-10">
          <img 
            src={logo} 
            alt="Logo" 
            className="mx-auto w-24 sm:w-32 mb-4 drop-shadow-xl"
          />
          <p className="text-gray-200 opacity-90 text-sm sm:text-base">
            Kerakli bo'limni tanlang
          </p>
        </div>

        {/* Qidiruv inputi */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bo'lim nomini qidirish..."
            className="w-full p-4 pl-14 pr-6 text-gray-800 rounded-2xl shadow-lg outline-none focus:ring-4 focus:ring-white/30 bg-white transition-all duration-300"
          />
        </div>

        {/* Kichik Kategoriyalar Ro'yxati */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSubCategories && filteredSubCategories.length > 0 ? (
              filteredSubCategories.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/kategoriyalar/${categoryKey}/${sub.id}`)}
                  className="bg-white text-gray-800 rounded-2xl shadow-xl p-5 flex items-center space-x-4 cursor-pointer transform hover:scale-[1.02] active:scale-95 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-4 bg-[#08778E] text-[#08778E] rounded-2xl">
                    <img src={logo} alt="icon" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-bold text-lg flex-1 text-gray-700">
                    {sub.nomi}
                  </span>
                  <FaChevronRight className="text-gray-300" size={20} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <FaBoxOpen size={70} className="mx-auto text-gray-400 mb-4 opacity-50" />
                <p className="text-xl text-gray-300">Bo'lim topilmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KichikKategoriyalar;