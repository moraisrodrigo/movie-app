import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Movie } from "../types/movie";

enum AppRoute {
    Index = '',
    Home = 'home',
    MovieWrapper = 'movie-wrapper',
    Movie = 'movie',
    MoviesList = 'movies-list',
    NotFound = 'not-found',
}

type MovieScreenRouteParams = {
    movie: Movie;
}

type RootStackParamList  = {
    [AppRoute.Home]: undefined,
    [AppRoute.Index]: undefined,
    [AppRoute.MovieWrapper]: undefined,
    [AppRoute.Movie]: MovieScreenRouteParams,
    [AppRoute.MoviesList]: undefined,
};

interface HomeRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Home> { }
interface IndexRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Index> { }
interface MovieRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Movie> { }
interface MoviesListRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.MoviesList> { }

export { AppRoute };

export type {
    RootStackParamList,
    HomeRouteParams,
    IndexRouteParams,
    MovieRouteParams,
    MoviesListRouteParams,
};
