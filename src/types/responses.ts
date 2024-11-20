import { Movie } from "./movie";

type MoviesListResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

// adult: boolean;
// backdrop_path: string;
// genre_ids: number[];
// id: number;
// original_language: string;
// original_title: string;
// overview: string;
// popularity: number;
// poster_path: string;
// release_date: string;
// title: string;
// video: boolean;
// vote_average: number;
// vote_count: number;
type MovieDetails = Movie & {
    genres: Array<{
        id: number;
        name: string;
    }>;
    status: string;
    runtime: number;
    // adult: boolean;
    // backdrop_path: string;
    // belongs_to_collection: null | unknown;
    // budget: number;
    // genres: Array<{
    //     id: number;
    //     name: string;
    // }>;
    // homepage: string;
    // id: number;
    // imdb_id: string;
    // original_language: string;
    // original_title: string;
    // overview: string;
    // popularity: number;
    // poster_path: string;
    // production_companies: Array<{
    //   id: number;
    //   logo_path: string | null;
    //   name: string;
    //   origin_country: string;
    // }>;
    // production_countries: Array<{
    //   iso_3166_1: string;
    //   name: string;
    // }>;
    // release_date: string;
    // revenue: number;
    // runtime: number;
    // spoken_languages: Array<{
    //   english_name: string;
    //   iso_639_1: string;
    //   name: string;
    // }>;
    // status: string;
    // tagline: string;
    // title: string;
    // video: boolean;
    // vote_average: number;
    // vote_count: number;
};

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

export type { MoviesListResponse, MovieDetails, MovieCreditsResponse, Cast };