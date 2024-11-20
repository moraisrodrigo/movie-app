
type MoviesListRequest = {
    page: number;
    include_adult?: string;
    include_video?: string;
    language?: string;
    sort_by?: string;
}

export type { MoviesListRequest };