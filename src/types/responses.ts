import { Genre, Movie } from "./movie";

type PersonalResponse = {
    success: boolean;
}

interface ListResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

type MoviesListResponse = ListResponse<Movie>

type GenresListResponse = {
    genres: Genre[]
}

type MovieDetails = Movie & {
    genres: Array<{
        id: number;
        name: string;
    }>;
    status: string;
    runtime: number;
};

type MovieVideo = {
    iso_639_1: string,
    iso_3166_1: string,
    name: string,
    key: string,
    site: string,
    size: number,
    type: string,
    official: true,
    published_at: string,
    id: string
}

type MovieVideosResult = {
    id: number,
    results: MovieVideo[]
}

type Cast = {
    adult: boolean;
    gender: number | null;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

type MovieCreditsResponse = {
    id: number;
    cast: Cast[];
};

type PersonMovies = {
    cast: Movie[]
}

export type {
    PersonalResponse,
    PersonMovies,
    MoviesListResponse,
    MovieDetails,
    MovieVideosResult,
    MovieVideo,
    MovieCreditsResponse,
    Cast,
    GenresListResponse,
};