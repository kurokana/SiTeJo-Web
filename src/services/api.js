import axios from 'axios';

const api_base_url = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: api_base_url,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error && error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        if (error && error.response && error.response.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ message: 'network error' });
    }
);

export default api;