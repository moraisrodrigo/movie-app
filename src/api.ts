import axios from "axios";
import { TMDB_API_KEY } from "./settings";

const setupInterceptor = () => {
    axios.interceptors.request.use(
        (config) => {

            const newConfig = config;

            newConfig.headers.Accept = 'application/json';

            newConfig.headers.Authorization = `Bearer ${TMDB_API_KEY}`;

            console.log('API_KEY = ', TMDB_API_KEY);

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
