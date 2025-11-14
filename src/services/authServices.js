import api from './api';

export const authServices = {
    register: async (userdata) => {
        try {
            const response = await api.post('/auth/register', userdata);

            if (response.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials) => {
        try{
            const response = await api.post('/auth/login', credentials);
        
            if (response.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try{
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
};

getCurrentUser: async () => {
    try {
        const response = await api.get('/auth/me');

        if (response.success){
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    } catch (error) {
        throw error;
    }
},

updateProfile = async (profileData) => {
    try {
        const response = await api.put('/auth/me', profileData); 
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
    } catch (error) {
        throw error;
    }
},

updateProfile = async (profileData) => {
    try {
        const response = await api.put('/auth/change-password', passwordData);
        return response;
    } catch (error) {
        throw error;
    }
},

isAuthenticated = () => {
    return !!localStorage.getItem('token');
},

getStoreUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};