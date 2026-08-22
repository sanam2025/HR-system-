import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE_URL = 'https://masarhr.alwaysdata.net/api/';


export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
    },
    timeout: 10000
})

apiClient.interceptors.request.use(
    (config) =>{
        const token = useAuthStore.getState().token;
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
    (response) =>  {
        return response;
    },
    
    (error) => {
        const {response} = error;

        if (response){
            if(response.status === 401){
                useAuthStore.getState().logout();
                console.warn('[API] Unauthorized — token cleared via authStore in client.ts');
            }
        }

        if(response?.status === 403){        }

        return Promise.reject(error);
    }

)