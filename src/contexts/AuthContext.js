import React, {createContext, useState, useContext, useEffect} from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (Credentials) => {
        try {
            const response = await authService.login(Credentials);
            setUser(response.data.user);
            return response;
        } catch (error) {
            // Extract validation error messages from Laravel response
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(' ');
                throw new Error(errorMessages);
            } else if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else if (error.response && error.response.status === 422) {
                throw new Error('Data yang Anda masukkan tidak valid. Silakan periksa kembali.');
            } else if (error.response && error.response.status === 401) {
                throw new Error('Email atau kata sandi salah.');
            }
            throw new Error('Terjadi kesalahan saat login. Silakan coba lagi.');
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            // Extract validation error messages from Laravel response
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(' ');
                throw new Error(errorMessages);
            } else if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    };


    const updateProfile = async (profileData) => {
        try { 
            const response = await authService.updateProfile(profileData);
            setUser(response.data.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user, login, logout, register, updateProfile, isAuthenticated: authService.isAuthenticated(), loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

