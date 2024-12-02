import { FunctionComponent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AntDesign, MaterialIcons  } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, Image, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { AppRoute, ProfileRouteParams } from "../../constants/routes";
import { AuthenticationContext, withAuthenticationContext } from "../../controllers/AuthenticationController";
import { image500 } from "../../services/movies";
import { ListItem } from "../elements/ListItem";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Movie } from "../../types/movie";
import { MoviesListResponse } from "../../types/responses";
import { Card } from "../elements/Card";

type Props = ProfileRouteParams & AuthenticationContext;

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
        authenticatedUser,
        login,
        logout,
        getFavouriteMovies,
        navigation: { navigate }
    } = props;

    const bottomSheetRef = useRef<BottomSheet>(null);

    const [listShown, setListShown] = useState<ListType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [moviesList, setMoviesList] = useState<MoviesListResponse>(initialList);

    useEffect(() => {
        onListChange();
    }, [listShown])

    const onMovieClick = (movie: Movie): void => navigate(AppRoute.MovieWrapper, { screen: AppRoute.Movie, params: { movie } });

    const onListChange = async () => {
        if (!bottomSheetRef.current) return;

        if (listShown) {
            fetchMovies();
            bottomSheetRef.current.snapToIndex(0);
        } else {
            bottomSheetRef.current.close();
        }
    }

    const fetchMovies = async (onReachEnd?: boolean) => {        
        if (isLoading) return;

        setIsLoading(true);

        const { page, results } = moviesList;

        const customPage: number = onReachEnd ? page + 1 : 1;

        const data: MoviesListResponse | null = await getFavouriteMovies({ page: customPage });

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

    const renderAvatar = (): ReactNode => {
        if (!authenticatedUser) return null;

        const { avatar: { tmdb: tmdbAvatar } } = authenticatedUser;

        const avatarPath = tmdbAvatar.avatar_path ? image500(tmdbAvatar.avatar_path) : null;

        if (avatarPath) return <Image source={{ uri: avatarPath }} style={styles.avatarImage} />;

        return <AntDesign name="user" size={80} color="white" style={styles.avatarFallback} />;
    };

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
                        color="white"
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
                        color="white"
                    />
                )}
            />
        </>
    );

    const renderCard = useCallback(({ item, index }: ListRenderItemInfo<Movie>) => (
        <Card movie={item} key={`${index}-${item.id}`} onClick={onMovieClick} />
    ), []);

    const renderBottomSheet = (): ReactNode => {
        return (
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                style={styles.bottomSheet}
                snapPoints={["90%"]}
                animateOnMount={false}
                onClose={() => setListShown(null)}
                enablePanDownToClose
                enableDynamicSizing={false}
                handleIndicatorStyle={{ backgroundColor: "white" }}
                backgroundStyle={{ backgroundColor: '#111111' }}
            >
                <BottomSheetFlatList
                    horizontal={false}
                    contentContainerStyle={styles.contentContainer}
                    scrollEnabled={true}
                    data={moviesList.results}
                    renderItem={renderCard}
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

const styles = StyleSheet.create({
    contentContainer: {
        padding: 10,
    },
	container: {
        flex: 1,
        height: '100%'
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
        color: '#FFFFFF',
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
        color: '#FFFFFF',
        marginBottom: 10,
    },
});

export const ProfileScreen = withAuthenticationContext(ProfileScreenComponent);