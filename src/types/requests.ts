type ListParams = {
    page: number
}

type MoviesListRequest = ListParams & {
    include_adult?: string;
    include_video?: string;
    language?: string;
    sort_by?: string;
}

type MovieListFilterRequest = ListParams & {
    with_genres: string, //can be a comma (,AND) or pipe (|OR) separated query
}

type MovieListSearchRequest = ListParams & {
    query: string;
}

export type { MoviesListRequest, MovieListSearchRequest, MovieListFilterRequest, ListParams };