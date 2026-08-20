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

apiClient.interceptors.request.use(
    (config) =>{
        const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN;
        const token = localStorage.getItem('token') || DEV_TOKEN || '4|adYsZORjUrpDGgjzLvwNXAZRL8M8eEUYk8laLCAX44215aec';
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
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        if(response?.status === 403){
            // console.warn("Access denied: Account pending approval.");
        }

        return Promise.reject(error);
    }

)