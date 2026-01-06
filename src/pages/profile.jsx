import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, User, Heart, Bell, Info, 
  MapPin, Phone, Languages, FileText, LogOut, ChevronRight,
  Home, ShoppingBag, Search, ArrowLeft
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { id: 1, title: "Buyurtmalarim", icon: ClipboardList, path: "/Buyurtmalar" },
    { id: 2, title: "Shaxsiy ma'lumotlar", icon: User, path: "/shaxsiyMalumotlar" },
    { id: 3, title: "Sevimlilar", icon: Heart, path: "/sevimlilar" },
    { id: 4, title: "Bildirishnomalar", icon: Bell, path: "/notification" },
    { id: 5, title: "Kompaniya haqida", icon: Info, path: "/haqida" },
    { id: 6, title: "Manzillar", icon: MapPin, path: "/manzillar" },
    { id: 7, title: "Biz bilan bog'lanish", icon: Phone, path: "/contact" },
    { id: 8, title: "Til", icon: Languages, path: "/language" },
    { id: 9, title: "Ommaviy oferta", icon: FileText, path: "/terms" },
  ];

  const handleLogout = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Container - Desktopda kenglikni cheklaymiz */}
      <div className="w-full max-w-2xl bg-white min-h-screen md:min-h-0 md:my-10 md:rounded-3xl md:shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header - Mobil ko'rinish */}
        <div className="p-4 flex items-center justify-between   md:px-8 md:py-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Profil</h1>
          <div className="w-10"></div> {/* Simmetriya uchun bo'sh joy */}
        </div>

        {/* User Info Section */}
        <div className="p-6 flex items-center gap-5 md:px-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <User size={40} className="text-blue-500 md:hidden" />
            <User size={50} className="text-blue-500 hidden md:block" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">Qobiljon</h2>
            <p className="text-gray-500 font-medium">+998932304637</p>
          </div>
        </div>

        {/* Menu Buttons Grid/List */}
        <div className="flex-1 px-4 pb-24 md:pb-10 md:px-8">
          <div className="bg-white border md:border-none rounded-2xl overflow-hidden shadow-sm md:shadow-none">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-blue-50 active:bg-blue-100 transition-all border-b border-gray-50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
                    <item.icon size={22} className="text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="text-[16px] md:text-[18px] font-medium text-gray-700">{item.title}</span>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}

            {/* Chiqish tugmasi */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-red-50 active:bg-red-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <LogOut size={22} className="text-red-500" />
                </div>
                <span className="text-[16px] md:text-[18px] font-medium text-red-600">Chiqish</span>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

 

      {/* Modal - Tasdiqlash oynasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl scale-in-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut size={32} className="text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Chiqish
            </h3>
            <p className="text-gray-500 text-center mb-8 px-2">
              Rostdan ham tizimdan chiqmoqchimisiz? Ma'lumotlaringiz saqlanib qoladi.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all active:scale-95"
              >
                Yo'q
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-4 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95"
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

export default ProfilePage;