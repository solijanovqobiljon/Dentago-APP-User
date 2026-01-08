import React, { createContext, useState, useEffect, useContext } from 'react';

// Context yaratamiz
const DataContext = createContext();

// Hook yaratamiz (useData orqali ishlatish uchun)
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // 1. Holatlar (States)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [user, setUser] = useState(null); // Tizimga kirgan foydalanuvchi ma'lumotlari

    // 2. Sahifa yuklanganda foydalanuvchini tekshirish
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('userData');

        if (accessToken && savedUser) {
            try {
                const userObj = JSON.parse(savedUser);
                setUser(userObj);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Foydalanuvchi ma'lumotlarini o'qishda xato:", e);
                // Agar xato bo'lsa, hammasini tozalaymiz
                logout();
            }
        }
        setAuthLoaded(true);
    }, []);

    // 3. Login/Register funksiyasi
    // Bu funksiya telefon va foydalanuvchi obyektini qabul qilib, saqlab qo'yadi
    const loginWithPhone = (phone, userObj = null) => {
        setIsAuthenticated(true);
        localStorage.setItem('userPhone', phone);

        if (userObj) {
            setUser(userObj);
            localStorage.setItem('userData', JSON.stringify(userObj));
        }
    };

    // 4. Logout funksiyasi
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userData');

        setIsAuthenticated(false);
        setUser(null);
    };

    // 5. Yuklash jarayoni (Loading)
    // Auth tekshirilmaguncha dasturni ko'rsatmay turamiz
    if (!authLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 font-medium text-gray-600">Yuklanmoqda...</span>
            </div>
        );
    }

    // 6. Provider orqali ma'lumotlarni tarqatamiz
    return (
        <DataContext.Provider value={{
            user,               // Foydalanuvchi obyekti (ism, familiya va h.k.)
            isAuthenticated,    // Tizimga kirganmi yoki yo'q
            loginWithPhone,     // Kirish funksiyasi
            logout              // Chiqish funksiyasi
        }}>
            {children}
        </DataContext.Provider>
    );
};