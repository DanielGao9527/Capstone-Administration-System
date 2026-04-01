import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        // 读取登录时存储的 JWT 令牌（key 必须与 Login.tsx 中 setItem 的 key 一致）
        const token = localStorage.getItem('cas_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
