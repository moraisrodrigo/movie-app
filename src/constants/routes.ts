import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Movie } from "../types/movie";

enum AppRoute {
    Index = '',
    Search = 'search',
    Profile = 'profile',
    Person = 'person',
    MovieWrapper = 'movie-wrapper',
    Movie = 'movie',
    MoviesList = 'movies-list',
    NotFound = 'not-found',
}

type MovieScreenRouteParams = {
    movie: Movie;
}

type PersonScreenRouteParams = {
    personId: string;
}

type MultipleScreenTab<AppRoute> = {
    screen: AppRoute;
}

type RootStackParamList  = {
    [AppRoute.Search]: undefined,
    [AppRoute.Index]: undefined,
    [AppRoute.Person]: PersonScreenRouteParams,
    [AppRoute.Profile]: undefined,
    [AppRoute.MovieWrapper]: MultipleScreenTab<AppRoute.Movie | AppRoute.MoviesList>,
    [AppRoute.Movie]: MovieScreenRouteParams,
    [AppRoute.MoviesList]: undefined,
};

interface SearchRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Search> { }
interface ProfileRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Profile> { }
interface PersonRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Person> { }
interface IndexRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Index> { }
interface MovieRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.Movie> { }
interface MoviesListRouteParams extends NativeStackScreenProps<RootStackParamList, AppRoute.MoviesList> { }

export { AppRoute };

export type {
    RootStackParamList,
    SearchRouteParams,
    ProfileRouteParams,
    PersonRouteParams,
    IndexRouteParams,
    MovieRouteParams,
    MoviesListRouteParams,
};
