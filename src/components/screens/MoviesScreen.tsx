import { FunctionComponent } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";
import { Movie, SectionKey } from "../../types/movie";
import { AppRoute, MoviesListRouteParams } from "../../constants/routes";
import { MoviesList } from "../elements/MoviesList";

interface Props extends MovieContext, MoviesListRouteParams {}

const MoviesScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate } } = props;

    const onMovieClick = (movie: Movie) => navigate(AppRoute.Movie, { movie })

    const renderLists = () => Object.values(SectionKey).map((key, index) => {
        return (
            <ScrollView key={`${index}-${key}`}>
                <MoviesList sectionKey={key} onMovieClick={onMovieClick}></MoviesList>
            </ScrollView>
        );
    });

    return (
        <ScrollView>
            <Button
                title="nova pagina"
                onPress={() => navigate(AppRoute.Home)}
            />
            {/* {firstMovie && (
                <View style={styles.mainCard}>
                    <MovieScreen movie={firstMovie} />
                </View>
            )} */}
            {renderLists()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
	mainCard: {
		padding: 10,
	},
    listTitle: {
        color: "#FFF"
    },
    horizontalList: {
        flexGrow: 1,
        display: "flex",
        marginVertical: 20,
    }
});

export const MoviesScreen = withMovieContext(MoviesScreenComponent);