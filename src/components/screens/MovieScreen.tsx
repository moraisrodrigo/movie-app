import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AppRoute, MovieRouteParams } from '../../constants/routes';
import { MovieContext, withMovieContext } from '../../controllers/MovieController';
import { Cast, MovieCreditsResponse, MoviesListResponse, MovieVideo, MovieVideosResult } from '../../types/responses';
import { CastComponent } from '../elements/Cast';
import { MoviesList } from '../elements/MoviesList';
import { Movie } from '../../types/movie';
import { MovieCover } from '../elements/MovieCover';
import { VideoPlayer } from '../elements/VideoPlayer';
import { AuthenticationContext, withAuthenticationContext } from '../../controllers/AuthenticationController';
import { ThemeContext, withThemeContext } from '../../controllers/ThemeController';
import { AppTheme } from '../../types/theme';

type Props = MovieRouteParams & MovieContext & AuthenticationContext & ThemeContext;

const MovieScreenComponent: FunctionComponent<Props> = (props: Props) => {
	const {
		route: { params: { movie } },
		navigation,
		theme,
		authenticatedUser,
		updateMovieFavourite,
		updateMovieWatchlist,
		getMovieCredits,
		getSimilarMovies,
		getMovieVideos,
	} = props;

	const styles = getStyles(theme === AppTheme.Dark);

    const [cast, setCast] = useState<Cast[]>([])
    const [videos, setVideos] = useState<MovieVideo[]>([]);

	const prepare = async (): Promise<void> => {
        const movieCredits: MovieCreditsResponse | null = await getMovieCredits(movie.id);
        const movieVideos: MovieVideosResult | null = await getMovieVideos(movie.id);

		setCast(movieCredits?.cast || [])
		setVideos(movieVideos?.results || [])
	};

	useEffect(() => {
		prepare();
	}, [movie]);

	const getMovies = (page: number): Promise<MoviesListResponse | null> => getSimilarMovies(movie.id, page);

    const onMovieClick = (movie: Movie): void => navigation.navigate(AppRoute.Movie, { movie });

	const renderSimilar = (): ReactNode => {
        return (
            <ScrollView style={styles.similarWrapper}>
                <MoviesList
					title='Similar Movies'
                    onMovieClick={onMovieClick}
                    getMovies={(page) => getMovies(page)}
                />
            </ScrollView>
        );
    };

	const addFavourite = async (): Promise<void> => {
		const { success } = await updateMovieFavourite(movie, true);

		let title = success ? 'Added to Favourites 🎉!' : 'An error ocurred'

		Toast.show({
			autoHide: true,
			type: success ? 'success' : 'error',
			text1: title,
			text2: success ? 'You can view all favourite movies in your profile page' : undefined,
		});		
	}

	const addWatchlist = async (): Promise<void> => {
		const { success } = await updateMovieWatchlist(movie, true);

		let title = success ? 'Added to Watchlist 🎉!' : 'An error ocurred'

		Toast.show({
			autoHide: true,
			type: success ? 'success' : 'error',
			text1: title,
			text2: success ? 'You can view watchlist movies in your profile page' : undefined,
		});		
	}

	const renderPersonal = (): ReactNode => {
		if (!authenticatedUser) return null;

		return (
			<View style={styles.personalWrapper}>
				<TouchableOpacity
					onPress={addFavourite}
					style={styles.personalIconWrapper}
				>
					<AntDesign name='hearto' size={34} color="#FF214A" />
					<Text style={styles.personalIconText}>Favourite</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={addWatchlist}
					style={styles.personalIconWrapper}
				>
					<MaterialIcons name="bookmark-border" size={36} color="#ffd866" />
					<Text style={styles.personalIconText}>Watchlist</Text>
				</TouchableOpacity>
			</View>
		)
	};

	const renderTrailers = (): ReactNode => {
		if (!videos || videos.length === 0) return null;

		return (
			<View style={styles.trailerWrapper}>
				<View style={styles.sectionTitleWrapper}>
					<View style={styles.line} />
					<View>
						<Text style={styles.trailerTitle}>Trailer</Text>
					</View>
					<View style={styles.line} />
				</View>
				<VideoPlayer video={videos[0]} />
			</View>
		)
	};

	const renderCast = (): ReactNode => <CastComponent cast={cast} navigation={navigation} />;

    return (
		<SafeAreaView>
			<ScrollView style={styles.screen}>
				<MovieCover movie={movie} />
				<Text style={styles.cardDescription}>
					{movie.overview}
				</Text>
				{renderPersonal()}
				{renderCast()}
				{renderTrailers()}
				{renderSimilar()}
			</ScrollView>
		</SafeAreaView>
    )
};

const getStyles = (isDarkTheme: boolean) => StyleSheet.create({
	screen: {
		position: 'relative',
		padding: 10,
		height: '100%'
	},
	trailerWrapper: {
		marginBottom: 5,
	},
	personalWrapper: {
		display: 'flex',
		flexDirection: 'row',
		paddingInline: 10,
		gap: 10,
		marginTop: 15,
	},
	personalIconWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	personalIconText: {
		color: isDarkTheme ? '#f7f7f7' : '#000000',
		fontSize: 14,
	},
	similarWrapper: {
		marginBottom: 25,
	},
	imageBackdrop: {
        borderRadius: 10,
		height: 248,
		backgroundColor: 'black'
	},
	cardContainer: {
		position: 'absolute',
		top: 32,
		right: 16,
		left: 16,
		flexDirection: 'row'
	},
	cardImage: {
		height: 184,
		width: 135,
		borderRadius: 3
	},
	cardDetails: {
		justifyContent: 'center',
		paddingLeft: 10,
		flex: 1
	},
	cardTitle: {
		color: 'white',
		fontSize: 19,
		fontWeight: '500',
		paddingTop: 10
	},
	cardGenre: {
		flexDirection: 'row'
	},
	cardGenreItem: {
		fontSize: 11,
		marginRight: 5,
		color: 'white'
	},
	trailerTitle: {
		color: isDarkTheme ? '#FFFFFF' : '#000000',
		paddingBottom: 5,
        fontWeight: 'bold'
	},
	cardDescription: {
		color: isDarkTheme ? '#F7F7F7' : '#000000',
		fontSize: 13,
		marginTop: 5
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
		fontSize: 12,
		color: 'white'
	},
	cardRunningHours: {
		marginLeft: 5,
		fontSize: 12
	},
	viewButton: {
		justifyContent: 'center',
		padding: 10,
		borderRadius: 3,
		backgroundColor: '#EA0000',
		width: 100,
		height: 30,
		marginTop: 10
	},
	viewButtonText: {
		color: 'white'
	},
    sectionTitleWrapper: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
	line: {
        flex: 1,
        height: 1,
        marginInline: 10,
        backgroundColor: '#FF214A'
    },
});

export const MovieScreen =  withMovieContext(withAuthenticationContext(withThemeContext(MovieScreenComponent)));
