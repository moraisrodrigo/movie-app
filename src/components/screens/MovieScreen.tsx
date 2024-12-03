import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { AppRoute, MovieRouteParams } from '../../constants/routes';
import { MovieContext, withMovieContext } from '../../controllers/MovieController';
import { Cast, MovieCreditsResponse, MoviesListResponse, MovieVideo, MovieVideosResult } from '../../types/responses';
import { CastComponent } from '../elements/Cast';
import { MoviesList } from '../elements/MoviesList';
import { Movie } from '../../types/movie';
import { MovieCover } from '../elements/MovieCover';
import { VideoPlayer } from '../elements/VideoPlayer';

interface Props extends MovieRouteParams, MovieContext { }

const MovieScreenComponent: FunctionComponent<Props> = (props: Props) => {
	const {
		route: {
			params: {
				movie,
			}
		},
		navigation,
		getMovieCredits,
		getSimilarMovies,
		getMovieVideos,
	} = props;

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

	const renderTrailers = (): ReactNode => {
		if (!videos || videos.length === 0) return null;

		return (
			<View style={styles.trailerWrapper}>
				<View style={styles.trailerTitleWrapper}>
					<View style={styles.line} />
					<View>
						<Text style={styles.trailerTitle}>Trailer</Text>
					</View>
					<View style={styles.line} />
				</View>
				<VideoPlayer video={videos[0]} />
			</View>
		)
	}

	const renderCast = () => {
		return <CastComponent cast={cast} navigation={navigation} />;
	}

    return (
		<SafeAreaView>
			<ScrollView style={styles.screen}>
				<MovieCover movie={movie} />
				<Text style={styles.cardDescription}>
					{movie.overview}
				</Text>
				{renderCast()}
				{renderTrailers()}
				{renderSimilar()}
			</ScrollView>
		</SafeAreaView>
    )
};

const styles = StyleSheet.create({
	screen: {
		position: 'relative',
		padding: 10,
		height: '100%'
	},
	trailerWrapper: {
		marginBottom: 5,
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
        color: 'white',
		paddingBottom: 5,
        fontWeight: 'bold'
	},
	cardDescription: {
		color: '#f7f7f7',
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
    trailerTitleWrapper: {
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

export const MovieScreen =  withMovieContext(MovieScreenComponent);
