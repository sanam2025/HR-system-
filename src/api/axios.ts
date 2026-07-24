import axios from 'axios';

// ── Base URL ──────────────────────────────────────────────────
const BASE_URL = 'https://masarhr.alwaysdata.net/api/';

// ── Axios Instance ────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor: أضف Bearer Token تلقائياً ───────────
// TODO: استبدل هذا بصفحة Login عند الانتهاء من التطوير
const DEV_TOKEN = '6|kd5AHpNWWFqykkNeKGovVMtB3Qe660vNxaani3sG364f143a';

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || DEV_TOKEN;
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor: تعامل مع 401 ───────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token منتهي أو غير صالح — امسح التوكن وأعد للـ Login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // يمكن إضافة redirect لاحقاً
      console.warn('[API] Unauthorized — token cleared.');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
