import React from 'react';
import { useCart } from '../CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Savat() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const jamiSumma = cartItems.reduce((acc, item) => acc + (item.narxi * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="bg-gray-100 p-8 rounded-full mb-6 text-gray-300">
          <FaShoppingCart size={80} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Savatda hali hech narsa yo'q</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">Siz asosiy sahifada mahsulotni qo'shishingiz mumkin</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-48 p-4">
      <h1 className="text-center text-xl font-bold mb-6 text-gray-800">Korzinka</h1>

      <div className="space-y-1">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-[24px] shadow-sm flex items-center relative">
            <button
              onClick={() => removeFromCart(item.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
            >
              <FaTrash size={14} />
            </button>

            {/* Tasvirni to'g'ri ko'rsatish */}
            <div
              className="w-20 h-20 mr-4 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => navigate(`/mahsulot/${item.categoryKey || 'stomatologiya'}/${item.subKey || 'materiallar'}/${item.id}`)}
            >
              <img
                src={item.image || item.rasm || '/placeholder-image.jpg'}
                alt={item.nomi}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div className="flex-1">
              <h3
                className="font-bold text-gray-800 text-sm mb-1 pr-6 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => navigate(`/mahsulot/${item.categoryKey || 'stomatologiya'}/${item.subKey || 'materiallar'}/${item.id}`)}
              >
                {item.nomi}
              </h3>
              <p className="text-[#00C2FF] text-[11px] font-bold mb-2">
                +{(item.narxi * item.quantity * 0.05).toLocaleString()} so'm bonus
              </p>

              <div className="flex items-center justify-between">
                <span className="font-black text-[17px] max-sm:text-[14px] text-gray-900">
                  {(item.narxi * item.quantity).toLocaleString()} so'm
                </span>

                <div className="flex items-center bg-[#F2F3F5] rounded-full px-3 py-1.5 gap-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-blue-500 active:scale-90 hover:bg-blue-50 rounded-full p-1"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="font-bold text-sm min-w-3 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-blue-500 active:scale-90 hover:bg-blue-50 rounded-full p-1"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 right-0 bg-white p-6 rounded-t-[32px] shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-40">
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Tovarlar ({cartItems.length})</span>
            <span className="font-bold text-black">{jamiSumma.toLocaleString()} so'm</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Yetkazib berish</span>
            <span className="text-green-500 font-bold">Bepul</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
            <span className="font-bold text-lg text-black">Jami</span>
            <span className="font-black text-2xl text-black">{jamiSumma.toLocaleString()} so'm</span>
          </div>
          <p className="text-[#00C2FF] text-[12px] text-right font-bold mt-1">
            Biz sizga bonuslar bilan to'laymiz +{(jamiSumma * 0.05).toLocaleString()} so'm
          </p>
        </div>
        <button
          className="w-full py-4 max-sm:py-3 max-sm:w-[70%] m-auto block bg-[#00C2FF] text-white rounded-[22px] font-bold text-lg shadow-lg active:scale-95 transition-all hover:bg-[#0099DD]"
        >
          Sotib olish
        </button>
      </div>
    </div>
  );
}

export default Savat;
