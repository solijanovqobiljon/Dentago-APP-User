import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Users, Megaphone, Bell, ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { RiToothLine } from "react-icons/ri";
import { MdGridView } from "react-icons/md";
import { useCart } from "../CartContext";
import axios from "axios";

// Rasmlarni import qilish
import Chair from "../assets/chair.png";
import Logo from "../assets/logo.png";

const categories = [
  { id: 'barchasi', label: 'Barchasi', Icon: MdGridView, path: '/' },
  { id: 'elonlar', label: 'Elonlar', Icon: Megaphone, path: '/elonlar' },
  { id: 'texniklar', label: 'Texniklar', Icon: RiToothLine, path: '/texniklar' },
  { id: 'ustalar', label: 'Ustalar', Icon: Users, path: '/ustalar' },
  { id: 'kurslar', label: 'kurslar', Icon: Users, path: '/kurs' },
];

const BASE_URL = "https://app.dentago.uz";

function Boshsaxifa() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("barchasi");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState({}); // Har bir mahsulot uchun loading holati
  
  const navigate = useNavigate();

  const slides = [
    { title: "Eng yaxshi uskunalarni\nbizdan topasiz", description: "Bizning mahsulotlar sifatli, ishonchli va qulay narxlarda!" },
    { title: "Professional stomatologiya\nasboblari", description: "Yuqori sifatli texnika va ishonchli xizmat." },
  ];

  // Mahsulotlarni API dan yuklash
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');

        const response = await axios.get(`${BASE_URL}/api/product`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        let productsData = [];
        if (response.data && response.data.data) {
          productsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
        }

        // Narxni formatlash va rasmni tayyorlash
        const formattedProducts = productsData.map(product => ({
          ...product,
          id: product._id,
          name: product.name || "Nomsiz mahsulot",
          price: product.price ? `${product.price.toLocaleString()} sum` : "Narx belgilanmagan",
          img: product.imageUrl && product.imageUrl.length > 0
            ? `${BASE_URL}/images/${product.imageUrl[0]}`
            : "https://via.placeholder.com/300x300?text=No+Image"
        }));

        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error("Mahsulotlarni yuklashda xato:", err);
        setError("Mahsulotlarni yuklab bo'lmadi. Internetni tekshiring.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mahsulotni savatga qo'shish funksiyasi
  const handleAddToCartAPI = async (product) => {
    try {
      // Loading holatini o'rnatish
      setCartLoading(prev => ({ ...prev, [product.id]: true }));
      
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        alert("Iltimos, avval tizimga kiring!");
        navigate('/login');
        return;
      }

      // API ga yuboriladigan ma'lumot
      const cartData = {
        product_id: product._id || product.id,
        quantity: 1,
        price: product.price ? parseFloat(product.price) : 0
      };

      console.log("Yuborilayotgan ma'lumot:", cartData);

      const response = await axios.post(
        `${BASE_URL}/api/cart/add`,
        cartData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API javobi:", response.data);

      if (response.data.success) {
        // Contextga ham qo'shamiz (agar kerak bo'lsa)
        const productData = {
          id: product.id,
          nomi: product.name,
          narxi: product.price ? parseInt(product.price.toString().replace(/\s/g, '').replace('sum', '')) : 0,
          image: product.img,
          quantity: 1
        };
        
        addToCart(productData);
        
      } else {
        alert("Mahsulot qo'shishda xato: " + (response.data.message || "Noma'lum xato"));
      }
    } catch (error) {
      console.error("Savatga qo'shishda xato:", error);
      
      // Xato xabarini chiqarish
      if (error.response) {
        console.error("Xato ma'lumoti:", error.response.data);
        alert(`Xato: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        alert("Serverga ulanib bo'lmadi. Internet aloqasini tekshiring.");
      } else {
        alert("Xato: " + error.message);
      }
    } finally {
      // Loading holatini olib tashlash
      setCartLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const notification = () => navigate('/notification');

  return (
    <div className="min-h-screen bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="p-4 sticky top-0 bg-white z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Shifokor qidirish..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl outline-none"
              />
            </div>
            <button onClick={notification} className="p-3 bg-gray-100 rounded-xl">
              <Bell />
            </button>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="px-4 md:px-8 py-6">
          <div className="relative group">
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-[300px] md:h-[450px] p-8 md:p-16 flex items-center relative">
                      <div className="w-full md:w-1/2 z-10">
                        <img src={Logo} className="w-52 transform max-sm:w-32 translate-x-[-12px]" alt="Logo" />
                        <h2 className="text-2xl md:text-5xl text-white mb-4 leading-tight whitespace-pre-line font-bold">{slide.title}</h2>
                        <p className="text-sm md:text-lg text-cyan-50 mb-8 max-w-md">{slide.description}</p>
                      </div>
                      <div className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 w-1/2 flex justify-end">
                        <img src={Chair} alt="Dental Chair" className="h-48 md:h-[350px] object-contain drop-shadow-2xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100"><ArrowLeft className="text-white" /></button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 rotate-180"><ArrowLeft className="text-white" /></button>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 md:px-8 pb-12">
          <div className="grid grid-cols-5 gap-4 md:gap-8">
            {categories.map(({ id, label, Icon, path }) => (
              <Link key={id} to={path} onClick={() => setActiveTab(id)} className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex border-2 items-center justify-center transition-all ${activeTab === id ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg' : 'bg-white border-cyan-500 text-cyan-500'}`}>
                  <Icon className="text-3xl md:text-4xl" />
                </div>
                <span className={`text-sm md:text-lg font-semibold ${activeTab === id ? 'text-cyan-700' : 'text-gray-600'}`}>{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Title */}
        <div className="flex items-center justify-between px-4 md:px-8 mb-6">
          <h1 className="font-bold text-[22px] md:text-[25px]">Ommabop mahsulotlar</h1>
          <div onClick={() => setIsModalOpen(true)} className="px-6 py-2 font-medium text-[16px] bg-[#BDF3FF] rounded-[10px] cursor-pointer text-black hover:bg-[#a2e9f7] transition-colors">
            Barchasi
          </div>
        </div>

        {/* Loading yoki Error */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Mahsulotlar yuklanmoqda...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* Main Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 mt-6 pb-10">
            {products.slice(0, 4).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                navigate={navigate} 
                onAddToCart={handleAddToCartAPI}
                isLoading={cartLoading[product.id] || false}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL - Barcha mahsulotlar */}
      {isModalOpen && !loading && !error && (
        <div className="fixed inset-0 bg-white z-[100] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 flex items-center gap-4 border-b border-gray-100 z-10 shadow-sm">
            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold">Barcha Mahsulotlar</h2>
          </div>
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  navigate={navigate} 
                  onAddToCart={handleAddToCartAPI}
                  isLoading={cartLoading[product.id] || false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, navigate, onAddToCart, isLoading }) {
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await onAddToCart(product);
  };

  return (
    <div
      onClick={() => navigate(`/mahsulot/${product.id}`)}
      className="bg-white cursor-pointer rounded-[30px] p-4 shadow-sm border border-gray-100 flex flex-col relative group transition-all hover:shadow-md h-full"
    >
      <button onClick={(e) => e.stopPropagation()} className="absolute right-4 top-4 z-10 text-gray-400 hover:text-red-500">
        <Heart size={22} />
      </button>

      <div className="bg-gray-50 rounded-[20px] overflow-hidden mb-4 flex items-center justify-center h-40 md:h-48">
        <img
          src={product.img}
          alt={product.name}
          className="object-contain h-full w-full p-4 group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Rasm+yuklanmadi"; }}
        />
      </div>

      <h3 className="text-gray-800 font-semibold text-[15px] md:text-[17px] mb-2 leading-tight min-h-[40px]">
        {product.name}
      </h3>

      <div className="mt-auto">
        <p className="text-black font-bold text-[18px] md:text-[20px] mb-3">
          {product.price}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-[#00C2FF]'} text-white py-3 rounded-[15px] flex items-center justify-center gap-2 font-bold active:scale-95 transition-all disabled:opacity-70`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Qo'shilmoqda...
            </>
          ) : (
            <>
              <ShoppingBag size={18} /> Savatga
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Boshsaxifa;