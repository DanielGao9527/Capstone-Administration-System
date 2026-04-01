import axios from 'axios';

// 运行时检测：浏览器在 localhost 时连本地后端，否则连 Azure 后端
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseURL = isLocal 
  ? 'http://localhost:8080/api/v1' 
  : 'https://cas-backend-team32-h5hxfffhd7ddccav.australiaeast-01.azurewebsites.net/api/v1';

const api = axios.create({
    baseURL,
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
