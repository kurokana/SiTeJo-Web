import axios from 'axios';

const api_base_url = ProcessingInstruction.env.react_app_api_base_url || 'http://localhost:3000/api';

const api = axios.create({
    baseURL0: api_base_url,
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
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response.data);
    }
    return promise.reject({message; 'network error'});
);

export default api;