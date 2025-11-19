import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            // 1. TAMBAH: Ambil CSRF cookie dari Laravel Sanctum
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include', // WAJIB
            });
            
            // 2. Gunakan URL Absolute
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // WAJIB untuk kirim cookie CSRF
                body: JSON.stringify(credentials),
            });
            
            // ... (kode selanjutnya)
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };
    
    const register = async (userData) => {
        try {
            // 1. TAMBAH: Ambil CSRF cookie
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include',
            });

            // 2. Gunakan URL Absolute
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // WAJIB untuk kirim cookie CSRF
                body: JSON.stringify(userData),
            });
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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