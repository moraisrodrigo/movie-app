import { FunctionComponent } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";
import { Movie, SectionKey } from "../../types/movie";
import { AppRoute, MoviesListRouteParams } from "../../constants/routes";
import { MoviesList } from "../elements/MoviesList";
import { MovieCover } from "../elements/MovieCover";
import { MoviesListResponse } from "../../types/responses";

interface Props extends MovieContext, MoviesListRouteParams {}

const MoviesScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate }, firstMovie, getMoviesList } = props;

    const onMovieClick = (movie: Movie) => navigate(AppRoute.Movie, { movie });

    const getMovies = (sectionKey: SectionKey, page: number): Promise<MoviesListResponse | null> => {
        return getMoviesList(sectionKey, { page });
    }

    const renderTitle = (sectionKey: SectionKey) => {
        let title: string = 'Movies';

        switch (sectionKey) {
            case SectionKey.NOW_PLAYING:
                title = "NOW_PLAYING"
                break;
            case SectionKey.POPULAR:
                title = "POPULAR"
                break;
            case SectionKey.TOP_RATED:
                title = "TOP_RATED"
                break;
            case SectionKey.UPCOMING:
                title = "UPCOMING"
                break;
            default:
                break;
        }

        return (
            <Text style={styles.listTitle}>{title}</Text>
        );
    };

    const renderLists = () => Object.values(SectionKey).map((key, index) => {
        return (
            <ScrollView key={`${index}-${key}`}>
                {renderTitle(key)}
                <MoviesList
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
                {renderLists()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		height: '100%'
	},
    listTitle: {
		marginTop: 10,
        color: "#FFF",
        textAlign: 'center'
    },
    horizontalList: {
        flexGrow: 1,
        display: "flex",
        marginVertical: 20,
    }
});

export const MoviesScreen = withMovieContext(MoviesScreenComponent);