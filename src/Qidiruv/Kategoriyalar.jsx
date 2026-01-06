import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stomatologiyaKatalogi } from './MalumotlarStatik';
import { FaThLarge, FaChevronRight, FaSearch, FaBoxOpen } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Kategoriyalar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Kategoriyalarni qidiruv bo'yicha filter qilish
  const filteredCategories = Object.keys(stomatologiyaKatalogi).filter((key) =>
    stomatologiyaKatalogi[key].sarlavha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mahsulotlarni global qidiruv bo'yicha topish
  const allFoundProducts = [];
  if (searchTerm.length > 1) {
    Object.keys(stomatologiyaKatalogi).forEach(catKey => {
      Object.keys(stomatologiyaKatalogi[catKey].items).forEach(subKey => {
        stomatologiyaKatalogi[catKey].items[subKey].forEach(product => {
          if (product.nomi.toLowerCase().includes(searchTerm.toLowerCase())) {
            allFoundProducts.push({ ...product, catKey, subKey });
          }
        });
      });
    });
  }

  return (
    <>
      {/* Orqa fonni butun ekranga yoyish uchun fixed div */}
      <div className="fixed inset-0 bg-[#08778E]"></div>

      {/* Asosiy kontent — scroll bo'lishi uchun relative va padding */}
      <div className="relative min-h-screen p-4 pb-32 pt-8 text-white">
        
        {/* Header qismi */}
        <div className="text-center my-10 px-4">
          <img 
            src={logo} 
            alt="Logo" 
            className="mx-auto w-32 sm:w-40 md:w-48 lg:w-56 mb-8 drop-shadow-xl"
          />
          
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium">
            Eng so’ngi stomatologiya uskunalari va 
            <br className="hidden sm:block" />
            dori-darmonlarini
            <span className="block mt-2 ml-[20px] text-[19px] sm:text-2xl md:text-5xl lg:text-4xl text-white font-bold border-b-4 border-white pb-2 inline-block">
              Sotib oling
            </span>
          </p>

          <p className="mt-6 text-base sm:text-lg text-gray-200 opacity-90">
            Sifatli mahsulotlar • Tez yetkazib berish • Arzon narxlar
          </p>
        </div>

        {/* Qidiruv inputi */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mahsulot yoki kategoriya nomi..."
            className="w-full p-4 pl-14 pr-6 text-gray-800 rounded-2xl shadow-lg outline-none focus:ring-4 focus:ring-white/30 bg-white transition-all duration-300"
          />
        </div>

        {/* Topilgan mahsulotlar */}
        {allFoundProducts.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-bold mb-5 text-white">
              Topilgan mahsulotlar ({allFoundProducts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allFoundProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/mahsulot/${item.catKey}/${item.subKey}/${item.id}`)}
                  className="bg-white text-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-4 flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.nomi} 
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-base line-clamp-2">{item.nomi}</h4>
                      <p className="text-[#08778E] font-semibold mt-1">{item.narxi} so'm</p>
                    </div>
                    <FaChevronRight className="text-gray-500 flex-shrink-0" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kategoriyalar */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Kategoriyalar</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((key) => (
                <div
                  key={key}
                  onClick={() => navigate(`/kategoriyalar/${key}`)}
                  className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 flex items-center space-x-5 cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-4 bg-[#08778E] text-white rounded-2xl">
                  <img src={logo} alt="" />     
                               </div>
                  <span className="font-bold text-lg flex-1">
                    {stomatologiyaKatalogi[key].sarlavha}
                  </span>
                  <FaChevronRight className="text-gray-500" size={44} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <FaBoxOpen size={70} className="mx-auto text-gray-400 mb-4 opacity-50" />
                <p className="text-xl text-gray-300">Hech narsa topilmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Kategoriyalar;