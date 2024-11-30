
interface User {
    id: number,
    iso_639_1:string,
    iso_3166_1:string,
    name:string,
    include_adult: boolean,
    username: string,
    avatar: {
        gravatar: {
            hash: string
        },
        tmdb: {
            avatar_path: string | null;
        }
    },
}

interface Person {
    adult: boolean,
    also_known_as: string[],
    biography: string,
    birthday: string,
    gender: number,
    id: number,
    imdb_id: string,
    known_for_department: string,
    name: string,
    place_of_birth: string,
    popularity: number,
    profile_path: string
}

export type { User, Person };