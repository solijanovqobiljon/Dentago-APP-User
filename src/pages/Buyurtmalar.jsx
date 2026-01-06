import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Buyurtmalar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  // Buyurtmalar ma'lumotlari bazasi
  const allOrders = [
    {
      id: 1,
      title: "Сыр Valio",
      date: "22.08.2024",
      price: "245 000 сум",
      status: "В пути",
      type: "active"
    },
    {
      id: 2,
      title: "Кофе Paulig Presidentti",
      date: "21.08.2024",
      price: "89 000 сум",
      status: "В обработке",
      type: "active"
    },
    {
      id: 3,
      title: "Кроссовки Nike Air Max",
      date: "15.08.2024",
      price: "650 000 сум",
      status: "Доставлен",
      type: "completed"
    },
    {
      id: 4,
      title: "Монитор Dell 27'",
      date: "10.08.2024",
      price: "2 800 000 сум",
      status: "Доставлен",
      type: "completed"
    },
    {
      id: 5,
      title: "Наушники Apple AirPods Pro",
      date: "05.08.2024",
      price: "1 500 000 сум",
      status: "Отменен",
      type: "cancelled"
    }
  ];

  // Tanlangan tabga qarab ma'lumotlarni filtrlash
  const filteredOrders = allOrders.filter(order => order.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl bg-white min-h-screen md:min-h-0 md:my-10 md:rounded-3xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 flex items-center border-b relative bg-white">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2 text-gray-800">
            Мои заказы
          </h1>
        </div>

        {/* Tabs Navigation */}
        <div className="p-4 bg-white border-b sticky top-0 z-10">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'active' 
                ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'completed' 
                ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Завершенные
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'cancelled' 
                ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Отмененные
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-4 flex-1 md:px-8">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{order.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">{order.date}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">{order.price}</span>
                  <span className={`px-4 py-1.5 rounded-xl text-sm font-semibold ${
                    order.type === 'active' ? 'bg-blue-50 text-blue-600' :
                    order.type === 'completed' ? 'bg-green-50 text-green-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p>Hozircha buyurtmalar yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buyurtmalar;