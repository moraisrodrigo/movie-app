import { FunctionComponent } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";
import { Movie, SectionKey } from "../../types/movie";
import { AppRoute, MoviesListRouteParams } from "../../constants/routes";
import { MoviesList } from "../elements/MoviesList";
import { MovieCover } from "../elements/MovieCover";
import { MoviesListResponse } from "../../types/responses";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface Props extends MovieContext, MoviesListRouteParams {}

const MoviesListScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate }, firstMovie, getMoviesList } = props;

    const onMovieClick = (movie: Movie): void => navigate(AppRoute.Movie, { movie });

    const getMovies = (sectionKey: SectionKey, page: number): Promise<MoviesListResponse | null> => {
        return getMoviesList(sectionKey, { page });
    }

    const getTitle = (sectionKey: SectionKey): string => {
        let title: string = 'Movies';

        switch (sectionKey) {
            case SectionKey.NOW_PLAYING:
                title = "Now Playing"
                break;
            case SectionKey.POPULAR:
                title = "Popular"
                break;
            case SectionKey.TOP_RATED:
                title = "Top rated"
                break;
            case SectionKey.UPCOMING:
                title = "Upcoming"
                break;
            default:
                break;
        }

        return title;
    };

    const renderLists = () => Object.values(SectionKey).map((key, index) => {
        return (
            <ScrollView key={`${index}-${key}`} style={styles.list}>
                <MoviesList
                    title={getTitle(key)}
                    onMovieClick={onMovieClick}
                    getMovies={(page) => getMovies(key, page)}
                />
            </ScrollView>
        );
    });

    return (
        <SafeAreaView>
            <ScrollView style={styles.screen}>
                {firstMovie && (
                    <MovieCover
                        movie={firstMovie}
                        onClick={() => onMovieClick(firstMovie)}
                    />
                )}
                <GestureHandlerRootView style={styles.container}>
                    {renderLists()}
                </GestureHandlerRootView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%'
	},
	screen: {
		padding: 10,
		height: '100%'
	},
	list: {
        marginVertical: 15,
	},
    horizontalList: {
        flexGrow: 1,
        display: "flex",
        marginVertical: 20,
    }
});

export const MoviesListScreen = withMovieContext(MoviesListScreenComponent);