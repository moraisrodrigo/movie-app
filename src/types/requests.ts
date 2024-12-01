
type MoviesListRequest = {
    page: number;
    include_adult?: string;
    include_video?: string;
    language?: string;
    sort_by?: string;
}

type MovieListFilterRequest = {
    page: number;
    with_genres: string, //can be a comma (,AND) or pipe (|OR) separated query
}

type MovieListSearchRequest = {
    page: number;
    query: string;
}

export type { MoviesListRequest, MovieListSearchRequest, MovieListFilterRequest };