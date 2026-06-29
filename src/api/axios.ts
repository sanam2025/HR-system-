import axios from 'axios';

// ── Base URL ─
const BASE_URL = 'http://masarhr.alwaysdata.net/api/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  transformResponse: [
    (data) => {
      if (typeof data === 'string') {
        try {
          // Clean up any prepended HTML warnings (like PHP deprecation notices)
          const firstBrace = data.indexOf('{');
          const firstBracket = data.indexOf('[');
          let startIdx = -1;

          if (firstBrace !== -1 && firstBracket !== -1) {
            startIdx = Math.min(firstBrace, firstBracket);
          } else if (firstBrace !== -1) {
            startIdx = firstBrace;
          } else if (firstBracket !== -1) {
            startIdx = firstBracket;
          }

          if (startIdx > 0) {
            console.warn('[API] Cleaned prepended non-JSON data from response.');
            return JSON.parse(data.substring(startIdx));
          }
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      }
      return data;
    }
  ]
});

// ── Request Interceptor: أضف Bearer Token تلقائياً ───
const DEV_TOKEN = '10|UOH1eLZEFAYFcl5psZ6vmWy706tYqyXtAUu8ZPOdf3a53759';

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || DEV_TOKEN;
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor: تعامل مع 401 ──
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
