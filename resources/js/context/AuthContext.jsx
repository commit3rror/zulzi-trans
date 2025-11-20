// resources/js/context/AuthContext.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import authService from '../../service/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk fetch user dari server (Validasi Session)
    const fetchUser = async () => {
        try {
            const res = await authService.me();
            setUser(res.data); // Simpan data user dari server
        } catch (error) {
            // Jika 401 Unauthorized, berarti session habis/belum login
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        // Setelah login sukses, set user state langsung dari response atau fetch ulang
        if (response.data && response.data.user) {
            setUser(response.data.user);
        } else {
            await fetchUser();
        }
        return response;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        // Auto login setelah register (backend sudah melakukan Auth::login)
        if (response.data && response.data.user) {
            setUser(response.data.user);
        } else {
            await fetchUser();
        }
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        // Opsional: redirect ke login page via window.location atau navigate
        window.location.href = '/login';
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
