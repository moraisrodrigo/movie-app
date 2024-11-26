import axios from "axios";
import { TMDB_API_TOKEN } from "./settings";

const setupInterceptor = () => {
    axios.interceptors.request.use(
        (config) => {

            const newConfig = config;

            newConfig.headers.Accept = 'application/json';

            newConfig.headers.Authorization = ` Bearer ${TMDB_API_TOKEN}`;

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
