import { FunctionComponent, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native';
import { AppRoute, MovieRouteParams } from '../../constants/routes';
import { MovieContext, withMovieContext } from '../../controllers/MovieController';
import { Cast, MoviesListResponse } from '../../types/responses';
import { CastComponent } from '../elements/Cast';
import { TMDB_IMG_URL } from '../../settings';
import { MoviesList } from '../elements/MoviesList';
import { Movie } from '../../types/movie';
import { MovieCover } from '../elements/MovieCover';

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
		getSimilarMovies
	} = props;

    const [cast, setCast] = useState<Cast[]>([])

	const prepare = async () => {
        const movieCredits = await getMovieCredits(movie.id);

		setCast(movieCredits?.cast ?? [])
	};

	useEffect(() => {
		prepare();
	}, [movie]);

	const getMovies = (page: number): Promise<MoviesListResponse | null> => getSimilarMovies(movie.id, page);
	
    const onMovieClick = (movie: Movie) => navigation.navigate(AppRoute.Movie, { movie });

	const renderSimilar = () => {
        return (
            <ScrollView>
                <MoviesList
                    onMovieClick={onMovieClick}
                    getMovies={(page) => getMovies(page)}
                />
            </ScrollView>
        );
    };

    return (
		<SafeAreaView>
			<ScrollView style={styles.screen}>
				<MovieCover movie={movie} />
				<Text style={styles.cardDescription} numberOfLines={3}>{movie.overview}</Text>
				<CastComponent cast={cast} navigation={navigation} />
				<Text style={styles.bolText}>Similar Movies</Text>
				{renderSimilar()}
			</ScrollView>
		</SafeAreaView>
    )
};

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		height: '100%'
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
	cardDescription: {
		color: '#f7f7f7',
		fontSize: 13,
		marginTop: 5
	},
	bolText: {
        color: 'white',
        fontWeight: 'bold'
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
	}
});

export const MovieScreen =  withMovieContext(MovieScreenComponent);
