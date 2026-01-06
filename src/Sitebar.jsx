import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaSearch, FaUser } from 'react-icons/fa';

function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // TO'G'IRLANGAN FUNKSIYA
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { id: 1, name: 'Bosh sahifa', icon: <FaHome size={22} />, path: '/' },
    { id: 2, name: 'Savatcha', icon: <FaShoppingBag size={22} />, path: '/savatcha' },
    { id: 3, name: 'Qidiruv', icon: <FaSearch size={22} />, path: '/kategoriyalar' },
    { id: 4, name: 'Profil', icon: <FaUser size={22} />, path: '/profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center w-full">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                active ? 'text-[#00C2FF]' : 'text-gray-400'
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-[10px] font-medium relative">
                {item.name}
                {/* Aktiv bo'lganda tagidagi chiziq */}
                {active && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00C2FF] rounded-full" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNavbar;
