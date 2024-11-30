import { TMDB_URL, TMDB_URL_SITE } from '../settings';

const createGuestSessionUrl = () => `${TMDB_URL}/authentication/guest_session/new`;

const createRequestTokenUrl = () => `${TMDB_URL}/authentication/token/new`;

const createSessionUrl = () => `${TMDB_URL}/authentication/session/new`;

const deleteSessionUrl = () => `${TMDB_URL}/authentication/session`;

const authenticateUrl = (token: string) => `${TMDB_URL_SITE}/authenticate/${token}`;

const accountUrl = () => `${TMDB_URL}/account`;

export {
    deleteSessionUrl,
    accountUrl,
    authenticateUrl,
    createGuestSessionUrl,
    createRequestTokenUrl,
    createSessionUrl
}