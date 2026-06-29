import axios from "axios";

const BASE_URL = 'http://masarhr.alwaysdata.net/api/'


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
        const token = '17|vwn1r3Remx1OKLL2SdiJbQPp10XluIPExp4nVitI4860582f'
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

        if(response.status === 403){
            console.warn("Access denied: Account pending approval.");
        }

        return Promise.reject(error);
    }

)