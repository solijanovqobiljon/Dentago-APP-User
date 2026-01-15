import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Truck, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useCart } from "../CartContext"; // CartContext ni ishlatamiz

const BASE_URL = "https://app.dentago.uz";

const ProductDetail = () => {
  const { id } = useParams(); // URL dan mahsulot ID si
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        let productData = null;

        if (token) {
          // Token bo'lsa, original API dan foydalanamiz
          const response = await axios.get(`${BASE_URL}/api/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          productData = response.data.data || response.data;
        } else {
          // Token bo'lmasa, barcha mahsulotlarni yuklab, filtrlaymiz
          const response = await axios.get(`${BASE_URL}/api/product/app/product/all?limit=200`);
          const allProducts = response.data.data || [];
          productData = allProducts.find(p => p._id === id);
        }

        if (!productData) {
          setError("Mahsulot topilmadi");
          return;
        }

        // Rasm va narxni formatlash (bosh sahifadagi kabi)
        const formattedProduct = {
          ...productData,
          id: productData._id || productData.id,
          name: productData.name || "Nomsiz mahsulot",
          price: productData.price ? `${productData.price.toLocaleString()} sum` : "Narx belgilanmagan",
          img: productData.imageUrl && productData.imageUrl.length > 0 ? `${BASE_URL}/images/${productData.imageUrl[0]}` : "",
          artikul: productData.artikul || productData.sku || "Belgilanmagan"
        };

        setProduct(formattedProduct);
        setError(null);
      } catch (err) {
        console.error("Mahsulotni yuklashda xato:", err);
        setError("Mahsulotni yuklab bo'lmadi. Internetni tekshiring.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const productData = {
      id: product.id,
      nomi: product.name,
      narxi: product.price ? parseInt(product.price.replace(/\s/g, '').replace('sum', '')) : 0,
      image: product.img,
      quantity: 1
    };
    addToCart(productData);
  };

  // Loading holati
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
        <p className="ml-4 text-gray-600">Mahsulot yuklanmoqda...</p>
      </div>
    );
  }

  // Xato holati
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-10 text-center">
        <p className="text-red-600 text-xl">{error || "Mahsulot topilmadi"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={28} />
        </button>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart size={24} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Rasm */}
      <div className="w-full h-80 md:h-96 flex items-center justify-center p-4 bg-gray-50">
        <img
          src={product.img}
          alt={product.name}
          className="max-h-full max-w-full object-contain rounded-2xl"
          onError={(e) => { e.target.src = ""; }}
        />
      </div>

      {/* Ma'lumotlar */}
      <div className="px-6 mt-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black">{product.name}</h1>
        <p className="text-gray-500 mt-2">
          Artikul: <span className="text-cyan-500 font-medium">{product.artikul}</span>
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mt-6 text-black">{product.price}</h2>
      </div>

      {/* Yetkazib berish */}
      <div className="mx-6 mt-8 p-5 bg-gray-50 rounded-2xl flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-lg text-green-600">
          <Truck size={28} />
        </div>
        <div>
          <p className="font-bold text-gray-800">Yetkazib berish</p>
          <p className="text-sm text-gray-600">Standart yetkazib berish — 3 kundan boshlab</p>
        </div>
      </div>

      {/* Tavsif (hozircha placeholder) */}
      <div className="px-6 mt-8">
        <h3 className="font-bold text-xl mb-4">Mahsulot tavsifi</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.description || "Tavsif hali qo'shilmagan. Tez orada yangilanadi."}
        </p>
      </div>

      {/* Pastki tugma - Savatga qo'shish */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-lg">
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#00C2FF] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <ShoppingBag size={20} /> Savatga qo'shish
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;