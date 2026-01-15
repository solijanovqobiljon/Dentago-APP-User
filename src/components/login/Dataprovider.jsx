import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem('accessToken');
            const savedUser = localStorage.getItem('userData');

            if (!accessToken || !savedUser) {
                setAuthLoaded(true);
                return;
            }

            try {
                const userObj = JSON.parse(savedUser);
                setUser(userObj);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Auth tekshirishda xato:", e);
                logout();
            } finally {
                setAuthLoaded(true);
            }
        };

        checkAuth();
    }, []);

    const loginWithPhone = (phone, userObj = null, accessToken = null, refreshToken = null) => {
        setIsAuthenticated(true);
        localStorage.setItem('userPhone', phone);

        if (userObj) {
            setUser(userObj);
            localStorage.setItem('userData', JSON.stringify(userObj));
        }

        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
    };

    if (!authLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 font-medium text-gray-600">Yuklanmoqda...</span>
            </div>
        );
    }

    return (
        <DataContext.Provider value={{
            user,
            isAuthenticated,
            loginWithPhone,
            logout
        }}>
            {children}
        </DataContext.Provider>
    );
};