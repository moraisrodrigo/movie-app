
interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

interface Genre {
    id: number,
    name: string
}

enum SectionKey {
    NOW_PLAYING = 'now_playing',
    POPULAR = 'popular',
    TOP_RATED = 'top_rated',
    UPCOMING = 'upcoming',
}

export { SectionKey };

export type {
    Movie,
    Genre
};
