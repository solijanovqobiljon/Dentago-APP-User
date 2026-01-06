import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Search, User } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Bosh sahifa", icon: Home },
    { path: "/savatcha", label: "Savatcha", icon: ShoppingBag },
    { path: "/qidiruv", label: "Qidiruv", icon: Search },
    { path: "/profil", label: "Profil", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1">
              <div className={`relative flex flex-col items-center transition-colors ${isActive ? "text-cyan-500" : "text-gray-400"}`}>
                <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[14px] md:text-[12px] font-medium">{item.label}</span>
                
                {/* Aktiv bo'lganda ostidagi chiziq */}
                {isActive && (
                  <div className="absolute -bottom-2 w-10 h-[3px] bg-cyan-500 rounded-full" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;