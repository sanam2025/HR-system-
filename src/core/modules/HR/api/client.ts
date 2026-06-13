// // core/modules/HR/api/client.ts
// import axios from 'axios';

// const API_BASE_URL = 'http://masarhr.alwaysdata.net/api/';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
// });

// // ✅ التوكن الثابت
// const TOKEN = '';

// apiClient.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

// // Interceptor للـ debugging
// apiClient.interceptors.request.use(
//   (config) => {
//     console.log(`🚀 API: ${config.method?.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default apiClient;

// core/modules/HR/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://masarhr.alwaysdata.net/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ✅ التوكن الثابت
const TOKEN = '15|qrQb0gHGJZsKTMIz2duW72Vyx6MKNnfpQS4hDLgw4664551a';

apiClient.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;