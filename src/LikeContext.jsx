import React, { createContext, useState, useContext, useEffect } from 'react';

const LikeContext = createContext();

// localStorage dan sevimlilarni o'qish
const getLikesFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const likes = localStorage.getItem('stomatology_likes');
    return likes ? JSON.parse(likes) : [];
  }
  return [];
};

// localStorage ga sevimlilarni saqlash
const saveLikesToLocalStorage = (likes) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('stomatology_likes', JSON.stringify(likes));
  }
};

export const LikeProvider = ({ children }) => {
  const [likedItems, setLikedItems] = useState([]);

  // Komponent yuklanganda localStorage dan sevimlilarni o'qish
  useEffect(() => {
    const savedLikes = getLikesFromLocalStorage();
    if (savedLikes.length > 0) {
      setLikedItems(savedLikes);
    }
  }, []);

  // likedItems o'zgarganda localStorage ga saqlash
  useEffect(() => {
    saveLikesToLocalStorage(likedItems);
  }, [likedItems]);

  // Mahsulotni sevimlilarga qo'shish/olib tashlash
  const toggleLike = (product) => {
    setLikedItems(prev => {
      const isAlreadyLiked = prev.some(item => item.id === product.id);

      if (isAlreadyLiked) {
        // Olib tashlash
        return prev.filter(item => item.id !== product.id);
      } else {
        // Qo'shish
        return [...prev, {
          ...product,
          likedAt: new Date().toISOString()
        }];
      }
    });
  };

  // Mahsulot sevimlilarga qo'shilganligini tekshirish
  const isLiked = (productId) => {
    return likedItems.some(item => item.id === productId);
  };

  // Barcha sevimlilarni o'chirish
  const clearLikes = () => {
    setLikedItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stomatology_likes');
    }
  };

  return (
    <LikeContext.Provider value={{
      likedItems,
      toggleLike,
      isLiked,
      clearLikes
    }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
