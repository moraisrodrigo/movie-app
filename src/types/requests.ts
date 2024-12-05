type ListParams = {
    page: number
}

type PersonalMovieListRequest = {
    media_type: "movie",
    media_id: number,
}

type MovieFavouriteRequest = PersonalMovieListRequest & {
    favorite: boolean
}

type MovieWatchListRequest = PersonalMovieListRequest & {
    watchlist: boolean
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

export type {
    MoviesListRequest,
    MovieListSearchRequest,
    MovieListFilterRequest,
    ListParams,
    MovieFavouriteRequest,
    MovieWatchListRequest,
};