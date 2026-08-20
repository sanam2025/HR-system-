import axios from "axios";

const BASE_URL = 'https://masarhr.alwaysdata.net/api/';


export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
    },
    timeout: 10000
})

import { getAuthToken } from '../store/authStore';

apiClient.interceptors.request.use(
    (config) =>{
        const token = getAuthToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        // if (response.data?.data?.Token) {
        //     localStorage.setItem('token', response.data.data.Token);

        //     if (response.data.data.user) {
        //         localStorage.setItem('user', JSON.stringify(response.data.data.user));
        //     }
        // }
        
        if (response.data?.Token) {
            const token = response.data.Token;
            const isRemember = localStorage.getItem('remember_me') === 'true';

            if (isRemember) {
                localStorage.setItem('token', token);
                if (response.data.data?.user) {
                    const userWithRole = { ...response.data.data.user, role: response.data.data.role, role_id: response.data.data.role_id };
                    localStorage.setItem('user', JSON.stringify(userWithRole));
                }
            } else {
                sessionStorage.setItem('token', token);
                if (response.data.data?.user) {
                    const userWithRole = { ...response.data.data.user, role: response.data.data.role, role_id: response.data.data.role_id };
                    sessionStorage.setItem('user', JSON.stringify(userWithRole));
                }
            }
        }
        
        return response;
    },
    (error) => {
        const { response } = error;

        if (response) {
            if (response.status === 401) {
                useAuthStore.getState().logout();
                console.warn('[API] Unauthorized — token cleared via authStore.');
            }
        }

        if (response?.status === 403) {
            console.warn("Access denied: Account pending approval.");
        }

        return Promise.reject(error);
    }
);