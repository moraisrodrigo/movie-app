import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from "react";
import {
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
import { SearchBar } from "../elements/SearchBar";
import { Entypo } from "@expo/vector-icons";

type Props = SearchRouteParams & MovieContext;

const initialList: MoviesListResponse = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
}

const SearchScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate }, getGenres, getMoviesSearch, getMoviesFilter } = props;

    const [moviesList, setMoviesList] = useState<MoviesListResponse>(initialList);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [textValue, setTextValue] = useState<string>('');
    const [genreSelected, setGenreSelected] = useState<Genre | null>(null);

    useEffect(() => {
        prepare();
    }, []);

    useEffect(() => {
        if (genreSelected !== null) {
            fetchMore(true);
        } else {
            clearMovies();
        }
    }, [genreSelected]);

    useEffect(() => {
        if (textValue) {
            fetchMore(true);
        } else {
            clearMovies();
        }
    }, [textValue]);

    const onGenreClick = (genre: Genre) => setGenreSelected(genre);

    const onMovieClick = (movie: Movie): void => navigate(AppRoute.SearchWrapper, { screen: AppRoute.Movie, params: { movie } });

    const prepare = async (): Promise<void> => {
        const genresList = await getGenres();

        setGenres(genresList);
    };

    const clearMovies = (): void => {
        setMoviesList(initialList);
    };

    const fetchMore = async (clearList: boolean = false): Promise<void> => {
        if (isLoading) return;

        setIsLoading(true);

        const { page, results } = moviesList;

        const customPage: number = clearList ? 1 : page + 1;

        let data: MoviesListResponse | null = null;

        if (textValue) {
            data = await getMoviesSearch({ page: customPage, query: textValue });
        } else if (genreSelected) {
            data = await getMoviesFilter({ page: customPage, with_genres: String(genreSelected.id) });
        }

        setIsLoading(false);

        if (!data) {
            clearMovies();
            return;
        }

        let newResults: Movie[] = [];

        if (!clearList) {
            const existingIds: Set<number> = new Set<number>(results.map(({ id }) => id));

            newResults = data.results.filter(({ id }) => !existingIds.has(id));

            newResults.unshift(...results)
        } else {
            newResults = newResults.concat(data.results);
        }

        setMoviesList((prevState) => ({
            ...prevState,
            ...data,
            results: newResults,
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

    const renderGenres = (): ReactNode => {
        if (genres.length === 0) return <></>;

        return (
            <ScrollView>
                {genres.map((genre: Genre) => (
                    <TouchableOpacity
                        onPress={() => onGenreClick(genre)}
                        key={genre.id}
                        style={styles.genreWrapper}
                    >
                        <Text style={styles.text} >
                            {genre.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    const renderMovies = (): ReactNode => {
        return (
            <>
                {genreSelected && (
                    <View style={styles.genreActiveWrapper}>
                        <TouchableOpacity
                            onPress={() => setGenreSelected(null)}
                            key={genreSelected.id}
                            style={styles.genreActive}
                        >
                            <Text style={styles.text} >
                                {genreSelected.name}
                                <Entypo
                                    name="cross"
                                    size={20}
                                    color="white"
                                    style={styles.cross}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {renderMoviesList()}
            </>
        )
    };

    const renderMoviesList = (): ReactNode => {
        return (
            <FlatList
                scrollEnabled={true}
                style={styles.flatListContainer}
                data={moviesList.results}
                numColumns={2}
                renderItem={renderCard}
                onEndReachedThreshold={0.3}
                onEndReached={() => fetchMore()}
                keyExtractor={(movie) => String(`${movie.id}`)}
            />
        )
    };

    return (
        <SafeAreaView>
            <View style={styles.screen}>
                <View style={styles.searchBar}>
                    <SearchBar onChange={setTextValue} />
                </View>
                {moviesList.results.length > 0 ? renderMovies() : renderGenres()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		height: '100%'
	},
	searchBar: {
        marginBottom: 10,
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
    genreActiveWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    genreActive: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 10,
        paddingBlock: 10,
        paddingInline: 20,
        marginBlock: 5,
        alignItems: 'center',
    },
    cross: {
        padding: 1,
        right: 10,
    },
	list: {
        marginVertical: 15,
	},
    horizontalList: {
        flexGrow: 1,
        display: "flex",
        marginVertical: 20,
    },
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