import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stomatologiyaKatalogi } from './MalumotlarStatik';
import { useCart } from '../CartContext';
import { FaArrowLeft, FaHeart, FaShareAlt, FaTruck, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';

// Ichki Notification komponenti
const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

};

// ✅ YANGI: localStorage uchun like utility funksiyalari (bir xil)
const getLikesFromStorage = () => {
  if (typeof window !== 'undefined') {
    const likes = localStorage.getItem('product_likes');
    return likes ? JSON.parse(likes) : [];
  }
  return [];
};

const saveLikesToStorage = (likes) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('product_likes', JSON.stringify(likes));
  }
};

const toggleLikeInStorage = (productId) => {
  const likes = getLikesFromStorage();
  const index = likes.indexOf(productId);

  if (index > -1) {
    // Olib tashlash
    likes.splice(index, 1);
  } else {
    // Qo'shish
    likes.push(productId);
  }

  saveLikesToStorage(likes);
  return !(index > -1); // Yangi holatni qaytaradi
};

const isLikedInStorage = (productId) => {
  const likes = getLikesFromStorage();
  return likes.includes(productId);
};
// ✅ YANGI: localStorage funksiyalari tugadi

const MahsulotDetallar = () => {
  const { categoryKey, subKey, productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [liked, setLiked] = useState(false); // ✅ YANGI: Like holati

  const product = stomatologiyaKatalogi[categoryKey]?.items[subKey]?.find(i => i.id === parseInt(productId));

  // ✅ YANGI: Komponent yuklanganda like holatini tekshirish
  useEffect(() => {
    if (product) {
      const isLiked = isLikedInStorage(product.id);
      setLiked(isLiked);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (isAdding) return;

    setIsAdding(true);

    // Mahsulotni savatga qo'shish
    addToCart({
      ...product,
      categoryKey,
      subKey,
    });

    // Notification ko'rsatish
    setNotificationMessage("Mahsulot savatchaga muvaffaqiyatli qo'shildi");
    setShowNotification(true);
  };

  // ✅ YANGI: Like bosilganda ishlaydigan funksiya
  const handleLikeClick = () => {
    if (!product) return;

    // Like tugmasini bosish
    const newLikedState = toggleLikeInStorage(product.id);
    setLiked(newLikedState);

    // Like holati haqida xabar
    const message = newLikedState
      ? "Mahsulot sevimlilarga qo'shildi"
      : "Mahsulot sevimlilardan olib tashlandi";

    setNotificationMessage(message);
    setShowNotification(true);
  };

  if (!product) return <div className="p-10 text-center text-gray-900 font-bold">Mahsulot topilmadi!</div>;

  return (
    <div className="bg-white min-h-screen pb-32">
      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Navbar */}
      <div className="flex items-center justify-between py-4 px-4 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div onClick={() => navigate(-1)} className="rounded-full cursor-pointer transition-colors">
          <FaArrowLeft size={20} className="text-gray-800" />
        </div>
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate('/savatcha')}
            className="rounded-full cursor-pointer relative"
          >
            <FaShoppingBag size={22} className="text-gray-700" />
          </div>
          <FaHeart
            size={22}
            className={`cursor-pointer transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-500'}`}
            onClick={handleLikeClick}
          />
          <FaShareAlt size={22} className="text-gray-300 cursor-pointer hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Rasm */}
      <div className="w-full h-80 bg-[#F9F9F9] flex items-center justify-center px-6 mb-6">
        <img src={product.image} alt={product.nomi} className="max-w-full max-h-full object-contain" />
      </div>

      {/* Info */}
      <div className="px-6">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 uppercase leading-tight">
          {product.nomi}
        </h1>
        <p className="text-sm text-gray-400 mb-4">Artikul: <span className="text-[#00C2FF] font-semibold">{product.artikul}</span></p>
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-3xl font-black text-gray-900">{product.narxi}</span>
          <span className="text-lg font-bold text-gray-900">sum</span>
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-4 bg-[#F2FBF9] p-4 rounded-[20px] mb-8 border border-green-50">
          <div className="bg-white p-3 rounded-xl shadow-sm"><FaTruck className="text-[#27AE60]" size={20} /></div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">Dostavka</p>
            <p className="text-[13px] text-gray-500">Standartnaya dostavka ot 1 dney</p>
          </div>
        </div>

        {/* Description */}
        <h3 className="text-xl font-bold mb-4 text-gray-900">Описание товара</h3>
        <div className="flex gap-3 items-start mb-6">
          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
          <p className="text-gray-600 font-medium leading-relaxed">{product.tavsif}</p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-15 left-0 right-0 py-7 px-9 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg bg-[#0085FF] text-white shadow-blue-100 active:scale-[0.97] hover:bg-blue-600`}
        >
         <FaShoppingBag size={18} /> Savatga qo'shish
        </button>
      </div>
    </div>
  );
};

export default MahsulotDetallar;
