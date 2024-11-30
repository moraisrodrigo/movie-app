
type MoviesListRequest = {
    page: number;
    include_adult?: string;
    include_video?: string;
    language?: string;
    sort_by?: string;
}

type MovieListSearchRequest = {
    page: number;
    with_genres: string, //can be a comma (,AND) or pipe (|OR) separated query
}

export type { MoviesListRequest, MovieListSearchRequest };