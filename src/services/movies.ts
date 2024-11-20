import { TMDB_URL, TMDB_API_KEY } from '../settings';
import { SectionKey } from '../types/movie';
import { MoviesListRequest } from '../types/requests';
import { objectToParams } from '../utils/objectToParams';

const moviesUrl = (section: SectionKey, request: MoviesListRequest) => `${TMDB_URL}/movie/${section}${objectToParams(request)}`

const movieDetails = (movieId: number) => `${TMDB_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`

const movieCredits = (movieId: number) => `${TMDB_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`

const movieSimilar = (movieId: number) => `${TMDB_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`

const image500 = (path?: string) => path ? `https://image.tmdb.org/t/p/w500/${path}` : null;

const image185 = (path: string | null) => path ? `https://image.tmdb.org/t/p/w185/${path}` : null;

export { moviesUrl, movieDetails, movieCredits, movieSimilar,image500,image185 };
