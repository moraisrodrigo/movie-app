import axios from "axios";
import { TMDB_API_TOKEN } from "./settings";

const setupInterceptor = (sessionId: string | null) => {
    axios.interceptors.request.use(
        (config) => {

            const newConfig = config;

            newConfig.headers.Accept = 'application/json';

            newConfig.headers["Content-Type"] = 'application/json';

            newConfig.headers.Authorization = ` Bearer ${TMDB_API_TOKEN}`;

            if (sessionId) newConfig.params = { ...newConfig.params, session_id: sessionId }

            return newConfig;
        },
        (err) => Promise.reject(err),
    );
};

const setup = (sessionId: string | null) => {
    axios.create({ withCredentials: true });
    setupInterceptor(sessionId);
}

export { setup };
