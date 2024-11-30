import { TMDB_IMG_URL, TMDB_URL } from '../settings';
import { SectionKey } from '../types/movie';
import { MovieListSearchRequest, MoviesListRequest } from '../types/requests';
import { objectToParams } from '../utils/objectToParams';

const moviesUrl = (section: SectionKey, request: MoviesListRequest) => `${TMDB_URL}/movie/${section}${objectToParams(request)}`

const movieDetails = (movieId: number) => `${TMDB_URL}/movie/${movieId}`

const genresURL = () => `${TMDB_URL}/genre/movie/list`

const discoverURL = (request: MovieListSearchRequest) => `${TMDB_URL}/discover/movie${objectToParams(request)}`

const movieCredits = (movieId: number) => `${TMDB_URL}/movie/${movieId}/credits`

const movieVideos = (movieId: number) => `${TMDB_URL}/movie/${movieId}/videos`

const movieSimilar = (movieId: number, page: number) => `${TMDB_URL}/movie/${movieId}/similar${objectToParams({ page })}`

const image500 = (path?: string): string | null => path ? `${TMDB_IMG_URL}/w500/${path}` : null;

const image185 = (path: string | null): string | null => path ? `${TMDB_IMG_URL}/w185/${path}` : null;

const image342 = (path: string | null): string | null => path ? `${TMDB_IMG_URL}/w342/${path}` : null;

export {
    moviesUrl,
    movieDetails,
    movieVideos,
    movieCredits,
    movieSimilar,
    genresURL,
    discoverURL,
    image500,
    image342,
    image185,
};
