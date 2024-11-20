import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Movie } from "../types/movie";

enum AppRoute {
    Index = '',
    Home = 'home',
    Profile = 'profile',
    MovieWrapper = 'movie-wrapper',
    Movie = 'movie',
    MoviesList = 'movies-list',
    NotFound = 'not-found',
}

type MovieScreenRouteParams = {
    movie: Movie;
}

type MultipleScreenTab<AppRoute> = {
    screen: AppRoute;
}

type RootStackParamList  = {
    [AppRoute.Home]: undefined,
    [AppRoute.Index]: undefined,
    [AppRoute.Profile]: undefined,
    [AppRoute.MovieWrapper]: MultipleScreenTab<AppRoute.Movie | AppRoute.MoviesList>,
    [AppRoute.Movie]: MovieScreenRouteParams,
    [AppRoute.MoviesList]: undefined,
};

interface HomeRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Home> { }
interface ProfileRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Profile> { }
interface IndexRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Index> { }
interface MovieRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Movie> { }
interface MoviesListRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.MoviesList> { }

export { AppRoute };

export type {
    RootStackParamList,
    HomeRouteParams,
    ProfileRouteParams,
    IndexRouteParams,
    MovieRouteParams,
    MoviesListRouteParams,
};
