import { API_KEY } from '@env'
import axios from "axios";

const setupInterceptor = () => {
    axios.interceptors.request.use(
        (config) => {

            const newConfig = config;

            newConfig.headers.Accept = 'application/json';

            newConfig.headers.Authorization = `Bearer ${API_KEY}`;

            console.log('API_KEY = ', API_KEY);

            return newConfig;
        },
        (err) => Promise.reject(err),
    );
};

const setup = () => {
    axios.create({ withCredentials: true });
    setupInterceptor();
}

export { setup };
