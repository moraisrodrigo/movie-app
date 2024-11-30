import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
    Button,
    FlatList,
    Image,
    ListRenderItemInfo,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AppRoute, SearchRouteParams } from "../../constants/routes";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";
import { Genre, Movie } from "../../types/movie";
import { MoviesListResponse } from "../../types/responses";
import { TMDB_IMG_URL } from "../../settings";

type Props = SearchRouteParams & MovieContext;

const initialList: MoviesListResponse = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
}

const SearchScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate }, getGenres, getMoviesSearch } = props;

    const [moviesList, setMoviesList] = useState<MoviesListResponse>(initialList);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [genreSelected, setGenreSelected] = useState<Genre | null>(null);

    useEffect(() => {
        prepare();
    }, []);

    useEffect(() => {
        if (genreSelected !== null) {
            fetchMore();
        } else {
            clearMovies();
        }
    }, [genreSelected])


    const onGenreClick = (genre: Genre) => setGenreSelected(genre);

    const onMovieClick = (movie: Movie): void => navigate(AppRoute.MovieWrapper, { screen: AppRoute.Movie, params: { movie } });

    const prepare = async () => {
        const genresList = await getGenres();

        setGenres(genresList);
    };

    const clearMovies = () => {
        setMoviesList(initialList);
    }

    const fetchMore = async () => {
        if (isLoading || !genreSelected) return;

        setIsLoading(true);

        const { page, results } = moviesList;

        const data: MoviesListResponse | null = await getMoviesSearch({ page: page + 1, with_genres: String(genreSelected.id) });

        setIsLoading(false);

        if (!data) return;

        const existingIds: Set<number> = new Set<number>(results.map(({ id }) => id));

        const uniqueMovies: Movie[] = data.results.filter(({ id }) => !existingIds.has(id));

        setMoviesList((prevState) => ({
            ...prevState,
            ...data,
            results: [...prevState.results, ...uniqueMovies],
        }));
    };

    const renderCard = useCallback(({ item, index }: ListRenderItemInfo<Movie>) => (
        <TouchableOpacity
            key={`${index}-${item.id}`}
            style={styles.movieItemContainer}
            onPress={() => onMovieClick(item)}
        >
            <View style={[ styles.movieItemView, { backgroundColor: 'grey' }]}>
                <Image source={{ uri: `${TMDB_IMG_URL}/w185/${item.poster_path}` }} style={styles.imageView} />
                <View style={[styles.movieDetailsContainer]}>
                    <Text
                        style={[ styles.title, { color: 'white' }]}
                        numberOfLines={1}
                    >
                    {item.title}
                    </Text>
                    <View
                    style={{
                        flex: 1,
                        justifyContent: "space-between",
                        flexDirection: "row",
                    }}
                    >
                    <Text style={[ styles.infoTitleData, { color: 'white' }]}>
                        {new Date(item.release_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        })}
                    </Text>
                    <Text style={[ styles.infoTitleData, { color: 'white' }]}>
                        ⭐️{item.vote_average.toFixed(2) + "/10"}
                    </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    ), []);

    const renderGenres = () => {
        if (genres.length === 0) return <></>;

        return genres.map((genre: Genre) => (
            <TouchableOpacity
                onPress={() => onGenreClick(genre)}
                key={genre.id}
                style={styles.genreWrapper}
            >
                <Text style={styles.text} >
                    {genre.name}
                </Text>
            </TouchableOpacity>
        ))
    }

    const renderMovies = () => {
        return (
            <>
                <View>
                    <Text>
                        clear genre
                    </Text>
                    {genreSelected && (
                        <Button
                            title={`${genreSelected.name} X`}
                            onPress={() => setGenreSelected(null)}
                        />
                    )}
                </View>
                {renderMoviesList()}
            </>
        )
    }

    const renderMoviesList = () => {
        return (
            <FlatList
                scrollEnabled={true}
                style={styles.flatListContainer}
                data={moviesList.results}
                numColumns={2}
                renderItem={renderCard}
                onEndReachedThreshold={0.3}
                onEndReached={fetchMore}
                keyExtractor={(movie) => String(`${movie.id}`)}
            />
        )
    }

    return (
        <SafeAreaView>
            {moviesList.results.length > 0 ?
                renderMovies() :
                <ScrollView style={styles.screen}>
                    {renderGenres()}
                </ScrollView>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		height: '100%'
	},
    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    genreWrapper: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 10,
        width: '100%',
        paddingBlock: 10,
        paddingInline: 15,
        marginBlock: 5,
        filter: 'blur',
    },
	list: {
        marginVertical: 15,
	},
    horizontalList: {
        flexGrow: 1,
        display: "flex",
        marginVertical: 20,
    },
    //---
    mainView: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
    },
    flatListContainer: {
        marginHorizontal: 4,
        marginTop: 4,
    },
    movieItemContainer: { flex: 1 / 2, margin: 4 },
    imageView: {
        height: 270,
        borderRadius: 18,
        resizeMode: "cover",
    },
    movieItemView: {
        flex: 1,
        borderRadius: 18,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
    },
    movieDetailsContainer: {
        padding: 8,
    },
    infoTitleData: { fontSize: 10, fontWeight: "500" },
});



export const SearchScreen = withMovieContext(SearchScreenComponent);