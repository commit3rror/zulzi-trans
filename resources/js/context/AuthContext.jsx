import React, { useState, useEffect, createContext, useContext } from 'react';
import authService from '@/services/authService'; 
import api from '@/services/api'; 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // ⚡ Initialize auth from localStorage
        useEffect(() => {
            const initAuth = async () => {
                try {
                    const token = localStorage.getItem('auth_token');
                    const storedUser = localStorage.getItem('user');
                    
                    console.log('🔐 Initializing auth...', { 
                        hasToken: !!token, 
                        hasStoredUser: !!storedUser 
                    });
                    
                    if (token) {
                        // Set Authorization header
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        
                        // ⚡ PRIORITAS 1: Load user dari localStorage dulu (untuk instant UI update)
                        if (storedUser) {
                            try {
                                const userData = JSON.parse(storedUser);
                                setUser(userData);
                                console.log('✅ User loaded from localStorage:', userData.nama);
                            } catch (e) {
                                console.error('❌ Failed to parse stored user:', e);
                            }
                        }
                        
                        // ⚡ PRIORITAS 2: Validate token dengan API dengan timeout
                        // Jangan clear data jika validate gagal - biarkan user tetap login
                        // hanya jika ada error 401 unauthorized baru clear
                        try {
                            // Create a promise race untuk timeout
                            const timeout = new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Auth check timeout')), 5000)
                            );
                            
                            const res = await Promise.race([
                                authService.me(),
                                timeout
                            ]);
                            
                            // Response dari /auth/me adalah { success: true, data: UserResource }
                            const freshUserData = res.data; 
                            
                            setUser(freshUserData);
                            localStorage.setItem('user', JSON.stringify(freshUserData));
                            console.log('✅ User verified from API:', freshUserData.nama);
                            
                        } catch (error) {
                            console.error('❌ Auth check error:', error);
                            // Hanya clear jika 401 Unauthorized, untuk error lain biarkan tetap login
                            if (error.response?.status === 401) {
                                console.log('❌ Unauthorized - clearing auth');
                                localStorage.removeItem('auth_token');
                                localStorage.removeItem('user');
                                api.defaults.headers.common['Authorization'] = null;
                                setUser(null);
                            } else {
                                // Untuk error lain (timeout, network, dll), tetap maintain user session
                                console.log('⚠️ Auth check failed but keeping user session:', error.message);
                            }
                        }
                    } else {
                        console.log('ℹ️ No auth token found');
                    }
                } finally {
                    // SELALU set loading ke false, bahkan jika ada error
                    setLoading(false);
                }
            };

            initAuth();
        }, []);

    // ⚡ Listen to storage changes (untuk sync antar tabs & OAuth callback)
    useEffect(() => {
        const handleStorageChange = (e) => {
            console.log('📦 Storage changed:', e.key);
            
            if (e.key === 'auth_token' && e.newValue) {
                // Token baru ditambahkan (dari OAuth callback)
                const token = e.newValue;
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Load user data
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        setUser(userData);
                        console.log('✅ User updated from storage event:', userData.nama);
                    } catch (e) {
                        console.error('❌ Failed to parse user from storage event:', e);
                    }
                }
            } else if (e.key === 'auth_token' && !e.newValue) {
                // Token dihapus (logout)
                setUser(null);
                api.defaults.headers.common['Authorization'] = null;
                console.log('🚪 User logged out via storage event');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (credentials) => {
        setIsAuthenticating(true); 
        try {
            const response = await authService.login(credentials);
            
            // Response dari backend:
            // {
            //   success: true,
            //   message: "Login berhasil",
            //   data: {
            //     user: {...},
            //     token: "...",
            //     role: "..."
            //   }
            // }
            // authService.login() return response.data, jadi:
            // response = { success, message, data: {user, token, role} }
            
            console.log('📊 Login response:', response);
            
            const loginData = response.data;
            const { token, user: userData } = loginData;
            
            console.log('🔑 Token:', token);
            console.log('👤 User:', userData);
            
            if (!token || !userData) {
                throw new Error('Invalid response structure: missing token or user data');
            }
            
            // 1. Simpan ke localStorage
            localStorage.setItem('auth_token', token); 
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 2. Set Authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 3. Update state
            setUser(userData);
            
            console.log('✅ Login successful:', userData.nama);
            
            // 4. Return user data untuk LoginPage
            return { 
                success: true, 
                user: userData,
                token: token
            }; 
            
        } catch(error) {
            console.error('❌ Login failed:', error);
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };
    
    const register = async (userData) => {
        const response = await authService.register(userData);
        return response;
    };

    const logout = async () => {
        setIsAuthenticating(true);
        try {
            await authService.logout();
        } catch (e) {
            console.error("Logout error", e);
        }
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        api.defaults.headers.common['Authorization'] = null;
        setUser(null);
        setIsAuthenticating(false);
        
        console.log('🚪 User logged out');
    };

    const updateUser = (updatedUser) => {
        console.log('🔄 Updating user:', updatedUser.nama);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        isAuthenticating,
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