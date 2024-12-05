import { FunctionComponent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AntDesign, MaterialIcons, Octicons, Feather } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Animated, Button, Image, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppRoute, ProfileRouteParams } from "../../constants/routes";
import { AuthenticationContext, withAuthenticationContext } from "../../controllers/AuthenticationController";
import { image500 } from "../../services/movies";
import { ListItem } from "../elements/ListItem";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Genre, Movie } from "../../types/movie";
import { MoviesListResponse } from "../../types/responses";
import { Card } from "../elements/Card";
import Toast, { ToastShowParams } from "react-native-toast-message";
import { ThemeContext, withThemeContext } from "../../controllers/ThemeController";
import { AppTheme } from "../../types/theme";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";

type Props = ProfileRouteParams & AuthenticationContext & ThemeContext & MovieContext;

enum ListType {
    Favourite = 'Favourite',
    Watchlist = 'Watchlist',
}

const initialList: MoviesListResponse = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
}

const ProfileScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const {
        theme,
        authenticatedUser,
        login,
        logout,
        getGenres,
        getFavouriteMovies,
        getWatchListMovies,
        updateMovieFavourite,
        updateMovieWatchlist,
        navigation: { navigate }
    } = props;

	const styles = getStyles(theme === AppTheme.Dark);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const [listShown, setListShown] = useState<ListType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moviesList, setMoviesList] = useState<MoviesListResponse>(initialList);

    useEffect(() => {
        onListChange();
    }, [listShown]);

    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        prepare();
    }, []);

    const prepare = async () => {
        const genresList = await getGenres();

        setGenres(genresList);
    }

    const onMovieClick = (movie: Movie): void => navigate(AppRoute.MovieWrapper, { screen: AppRoute.Movie, params: { movie } });

    const onListChange = async () => {
        if (!bottomSheetRef.current) return;

        if (listShown) {
            setMoviesList(initialList);
            fetchMovies();
            bottomSheetRef.current.snapToIndex(0);
        } else {
            bottomSheetRef.current.close();
        }
    }

    const fetchMovies = async (onReachEnd?: boolean) => {        
        if (isLoading || !listShown) return;

        setIsLoading(true);

        const { page, results } = moviesList;

        const customPage: number = onReachEnd ? page + 1 : 1;

        const getMovies = listShown === ListType.Favourite ? getFavouriteMovies : getWatchListMovies;

        const data: MoviesListResponse | null = await getMovies({ page: customPage });

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

    const onBottomSheetClose = (): void => {
        setMoviesList(initialList);
        setListShown(null);
    }

    const renderAvatar = (): ReactNode => {
        if (!authenticatedUser) return null;

        const { avatar: { tmdb: tmdbAvatar } } = authenticatedUser;

        const avatarPath = tmdbAvatar.avatar_path ? image500(tmdbAvatar.avatar_path) : null;

        if (avatarPath) return <Image source={{ uri: avatarPath }} style={styles.avatarImage} />;

        return <AntDesign name="user" size={80} color="white" style={styles.avatarFallback} />;
    };

    const renderThemeListItem = (): ReactNode => {
        const { setTheme, theme } = props;

        const newTheme: AppTheme = theme === AppTheme.Dark ? AppTheme.Light : AppTheme.Dark;

        return (
            <ListItem
                label={`${newTheme} Theme`}
                onClick={() => setTheme(newTheme)}
                startIcon={(
                    <View style={[styles.circle, styles.backgroudPurple]}>
                        {newTheme === AppTheme.Dark ? (
                            <MaterialIcons
                                name="sunny"
                                size={26}
                                color="white"
                            />
                        ) : (
                            <Feather
                                name="moon"
                                size={26}
                                color="white"
                            />
                        )}
                    </View>
                )}
                endIcon={(
                    <MaterialIcons
                        name="arrow-forward-ios"
                        size={26}
                        color={theme === AppTheme.Dark ? "#FFFFFF" : "#000000"}
                    />
                )}
            />
        )
    }

    const renderListItems = (): ReactNode => (
        <>
            <ListItem
                label="Favourite Movies"
                onClick={() => setListShown(ListType.Favourite)}
                startIcon={(
                    <View style={[styles.circle, styles.backgroudRed]}>
                        <MaterialIcons
                            name="favorite"
                            size={26}
                            color="white"
                        />
                    </View>
                )}
                endIcon={(
                    <MaterialIcons
                        name="arrow-forward-ios"
                        size={26}
                        color={theme === AppTheme.Dark ? "#FFFFFF" : "#000000"}
                    />
                )}
            />
            <ListItem
                label="Watchlist Movies"
                onClick={() => setListShown(ListType.Watchlist)}
                startIcon={(
                    <View style={[styles.circle, styles.backgroudYellow]}>
                        <MaterialIcons
                            name="bookmark"
                            size={26}
                            color="white"
                        />
                    </View>
                )}
                endIcon={(
                    <MaterialIcons
                        name="arrow-forward-ios"
                        size={26}
                        color={theme === AppTheme.Dark ? "#FFFFFF" : "#000000"}
                    />
                )}
            />
            {renderThemeListItem()}
        </>
    );

    const removeMovie = async (movie: Movie, listType: ListType | null): Promise<void> => {
        const errorToastParams: ToastShowParams = { autoHide: true, type: 'error', text1: 'An error ocurred' };

        if (!listType) return Toast.show(errorToastParams);

        const isFavouriteList: boolean = listType === ListType.Favourite;

        const update = isFavouriteList ? updateMovieFavourite : updateMovieWatchlist;

		const { success } = await update(movie, false);

        if (!success) return Toast.show(errorToastParams);

        setMoviesList((prevMovieList: MoviesListResponse) => ({
            ...prevMovieList,
            results: prevMovieList.results.filter((prevMovie: Movie) => prevMovie.id !== movie.id),
        }))

		let title = isFavouriteList ? 'Removed from Favourites' : 'Removed from Watchlist'

        Toast.show({ autoHide: true, type: success ? 'success' : 'error', text1: title });	
    }

    const renderRightAction = (movie: Movie, listType: ListType | null, drag: Animated.AnimatedInterpolation<string | number>): ReactNode => {
        const scale = drag.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
        })
        
        return (
            <TouchableOpacity style={{ ...styles.rightAction, transform: [{ scale }]}} onPress={() => removeMovie(movie, listType)}>
                <Octicons name="trash" color="white" size={26} />
            </TouchableOpacity>
        );
    }

    const renderCard = useCallback(({ item: movie, index }: ListRenderItemInfo<Movie>, listType: ListType | null) => {

        const genre: Genre | undefined = genres.find((genre: Genre) => genre.id === movie.genre_ids[0]);

        return (
            <Swipeable
                renderRightActions={(_, drag) => renderRightAction(movie, listType, drag)}
                key={`${index}-${movie.id}`}
            >
                <View style={styles.movieWrapper}>
                    <Card
                        movie={movie}
                        key={`${index}-${movie.id}`}
                        onClick={onMovieClick}
                    />
                    <View style={styles.cardDetails}>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                            {movie.original_title}
                        </Text>
                        {genre && (
                            <View style={styles.cardGenre}>
                                <Text style={styles.cardGenreItem}>{genre.name}</Text>
                            </View>
                        )}
                        <View style={styles.cardNumbers}>
                            <View style={styles.cardStar}>
                                <AntDesign name='star' color="#FFFF00" size={40} style={styles.star}/>
                                <Text style={styles.cardStarRatings}>{movie.vote_average.toFixed(1)}/10</Text>
                            </View>
                            <Text style={styles.cardRunningHours} />
                        </View>
                        <Text numberOfLines={3} style={styles.cardDescription}>
                            {movie.overview}
                        </Text>
                    </View>
                </View>
            </Swipeable>
        )
    }, []);

    const renderBottomSheet = (): ReactNode => {
        const { theme } = props;

        const isDarkTheme: boolean = theme === AppTheme.Dark;

        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                style={styles.bottomSheet}
                snapPoints={["90%"]}
                animateOnMount={false}
                onClose={onBottomSheetClose}
                enablePanDownToClose
                enableDynamicSizing={false}
                handleIndicatorStyle={{ backgroundColor: isDarkTheme ? 'white' : '#111111' }}
                backgroundStyle={{ backgroundColor: isDarkTheme ? '#111111' : 'white' }}
            >
                <BottomSheetFlatList
                    horizontal={false}
                    contentContainerStyle={styles.contentContainer}
                    scrollEnabled={true}
                    data={moviesList.results}
                    renderItem={(item) => renderCard(item, listShown)}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => fetchMovies(true)}
                    keyExtractor={(movie) => String(`${movie.id}`)}
                />
            </BottomSheet>
        )
    };

    const renderAuthUser = (): ReactNode => {
        if (!authenticatedUser) return null;

        const { username, name } = authenticatedUser;

        return (
            <View style={styles.screen}>
                {renderAvatar()}
                <Text style={styles.profileName}>{name || username}</Text>
                {renderListItems()}
                <Button title="Logout" onPress={logout} />
                {renderBottomSheet()}
            </View>
        );
    }

    const renderNonAuthUser = (): ReactNode => {
        return (
            <View style={styles.nonAuthWrapper}>
                <Text style={styles.nonAuth}>Login with your account</Text>
                <Button title="Login" onPress={login} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                {authenticatedUser ? renderAuthUser() : renderNonAuthUser()}
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const getStyles = (isDarkTheme: boolean) => StyleSheet.create({
    contentContainer: {
        padding: 10,
    },
	container: {
        flex: 1,
        height: '100%'
    },
    rightAction: {
        width: 100,
        marginStart: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
	movieWrapper: {
        paddingBlock: 10,
        flexDirection: 'row',
    },
    bottomSheet: {
        zIndex: 1,
    },
    bottomSheetContent: {
        flex: 1,
        alignItems: 'center',
    },
    screen: {
        padding: 20,
        alignItems: 'center',
        height: '100%',
    },
    avatarImage: {
        width: 140,
        height: 140,
        borderRadius: 40,
        marginBottom: 10,
    },
    avatarFallback: {
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
		color: isDarkTheme ? '#F7F7F7' : '#000000',
    },
    list: {
        width: '100%',
    },
    circle: {
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
    },
    backgroudRed: {
        backgroundColor: '#FF214A'
    },
    backgroudPurple: {
        backgroundColor: '#8d32aa'
    },
    backgroudYellow: {
        backgroundColor: '#ffd866'
    },
    nonAuthWrapper: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    nonAuth: {
        textAlign: 'center',
        marginBottom: 10,
    },
    cardDetails: {
		paddingLeft: 10,
		flex: 1,
        gap: 8,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		paddingTop: 10
	},
	cardGenre: {
		flexDirection: 'row'
	},
	cardGenreItem: {
		fontWeight: '600',
		fontSize: 11,
		marginRight: 5,
	},
	cardNumbers: {
		flexDirection: 'row',
		marginTop: 5
	},
	cardStar: {
		flexDirection: 'row'
	},
	cardStarRatings: {
		marginLeft: 5,
		fontWeight: '600',
		fontSize: 12,
	},
	star: {
		fontSize: 12,
	},
	cardRunningHours: {
		marginLeft: 5,
		fontSize: 12
	},
    cardDescription: {
		fontSize: 13,
		marginTop: 5
	},
});

export const ProfileScreen = withAuthenticationContext(withThemeContext(withMovieContext(ProfileScreenComponent)));