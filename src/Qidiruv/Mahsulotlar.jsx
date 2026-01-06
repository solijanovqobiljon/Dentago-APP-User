import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stomatologiyaKatalogi } from './MalumotlarStatik';
import { useCart } from '../CartContext';
import { FaArrowLeft, FaHeart, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';

// Ichki Notification komponenti
const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

};

// ✅ YANGI: localStorage uchun like utility funksiyalari
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
  return !(index > -1); // Yangi holatni qaytaradi (true - liked, false - not liked)
};

const isLikedInStorage = (productId) => {
  const likes = getLikesFromStorage();
  return likes.includes(productId);
};
// ✅ YANGI: localStorage funksiyalari tugadi

const Mahsulotlar = () => {
  const { categoryKey, subKey } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [likedProducts, setLikedProducts] = useState([]); // ✅ YANGI: Liked mahsulotlar holati

  // ✅ YANGI: Komponent yuklanganda liked mahsulotlarni yuklash
  useEffect(() => {
    const likes = getLikesFromStorage();
    setLikedProducts(likes);
  }, []);

  const category = stomatologiyaKatalogi[categoryKey];
  const subCategory = category?.subCategories.find(s => s.id === subKey);
  const items = category?.items[subKey] || [];

  const handleAddToCart = (item, e) => {
    e.stopPropagation();

    // Mahsulotni savatga qo'shish
    addToCart({
      ...item,
      categoryKey,
      subKey,
    });

    // Notification ko'rsatish
    setNotificationMessage("Mahsulot savatga qo'shildi");
    setShowNotification(true);
  };

  // ✅ YANGI: Like bosilganda ishlaydigan funksiya
  const handleLikeClick = (item, e) => {
    e.stopPropagation();

    // Like tugmasini bosish
    const newLikedState = toggleLikeInStorage(item.id);

    // Local state ni yangilash
    const updatedLikes = getLikesFromStorage();
    setLikedProducts(updatedLikes);

    // Like holati haqida xabar
    const message = newLikedState
      ? "Mahsulot sevimlilarga qo'shildi"
      : "Mahsulot sevimlilardan olib tashlandi";

    setNotificationMessage(message);
    setShowNotification(true);
  };

  return (
    <div className="bg-white min-h-screen p-4 pb-24">
      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl cursor-pointer active:scale-90">
          <FaArrowLeft className="text-gray-700" size={18} />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{subCategory?.nomi || "Mahsulotlar"}</h1>
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate('/savatcha')}
            className="p-2 bg-white rounded-xl relative cursor-pointer active:scale-90"
          >
            <FaShoppingBag className="text-gray-700" size={18} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 max-[810px]:grid-cols-2 max-[450px]:grid-cols-1 gap-4">
        {items.map((item) => {
          const liked = likedProducts.includes(item.id); // ✅ YANGI: likedProducts dan foydalanish

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/mahsulot/${categoryKey}/${subKey}/${item.id}`)}
              className="bg-white p-3 rounded-[28px] shadow-sm relative flex flex-col active:scale-[0.98] transition-all cursor-pointer border border-gray-100 hover:shadow-md"
            >
              {/* Like button */}
              <div
                onClick={(e) => handleLikeClick(item, e)}
                className="absolute top-4 right-4 z-10 bg-white/90 p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform active:scale-90"
              >
                <FaHeart
                  className={`${liked ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                  size={16}
                />
              </div>

              <div className="h-36 mb-3 bg-[#F9F9F9] rounded-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nomi}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="px-1">
                <h3 className="text-[14px] font-semibold text-gray-800 mb-1 h-10 overflow-hidden leading-tight">
                  {item.nomi}
                </h3>

                <div className="flex flex-col mb-3">
                  <span className="text-[11px] text-gray-400">Artikul: {item.artikul}</span>
                  <p className="text-[16px] font-black text-gray-900">{item.narxi} sum</p>
                </div>

                <button
                  onClick={(e) => handleAddToCart(item, e)}
                  className="w-full py-2.5 bg-[#E8F4FF] text-[#0085FF] rounded-xl font-bold flex items-center justify-center gap-2 text-xs active:bg-blue-100 transition-colors hover:bg-blue-50"
                >
                  <FaShoppingBag size={14} /> Savatga qo'shish
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mahsulotlar;
