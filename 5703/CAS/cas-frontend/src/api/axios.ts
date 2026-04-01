import axios from 'axios';

// 生产环境使用 Azure 后端域名，开发环境保持本地 localhost
const isProd = import.meta.env.PROD;
const baseURL = isProd 
  ? 'https://cas-backend-team32.azurewebsites.net/api/v1' 
  : 'http://localhost:8080/api/v1';

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
