import { TMDB_URL } from '../settings';

const personUrl = (personId: string) => `${TMDB_URL}/person/${personId}`

const personMoviesUrl = (personId: string) => `${TMDB_URL}/person/${personId}/movie_credits`

export {
    personUrl,
    personMoviesUrl,
};
