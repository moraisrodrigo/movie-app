import { FunctionComponent, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Image, Text, View } from 'react-native';
import { MovieRouteParams } from '../../constants/routes';
import { MovieContext, withMovieContext } from '../../controllers/MovieController';
import { Cast, MoviesListResponse } from '../../types/responses';
import { CastComponent } from '../elements/Cast';
import { TMDB_IMG_URL } from '../../settings';

interface Props extends MovieRouteParams, MovieContext { }

const PersonScreenComponent: FunctionComponent<Props> = (props: Props) => {
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
    const [similarMovies, setSimilarMovies] = useState<MoviesListResponse | null>()

	const prepare = async () => {
        const movieCredits = await getMovieCredits(movie.id);
        const moviesSimilar = await getSimilarMovies(movie.id);

		setCast(movieCredits?.cast ?? [])
		setSimilarMovies(moviesSimilar)
	};

	useEffect(() => {
		prepare();
	}, []);


    return (
		<ScrollView style={styles.screen}>
            <Image source={{ uri: `${TMDB_IMG_URL}/w780/${(movie.backdrop_path || movie.poster_path)}` }} style={styles.imageBackdrop} />
			<View style={styles.cardContainer}>
				<Image source={{ uri: `${TMDB_IMG_URL}/w185/${movie.poster_path}` }} style={styles.cardImage} />
				<View style={styles.cardDetails}>
					<Text style={styles.cardTitle} numberOfLines={2}>
						{movie.original_title}
					</Text>
					<View style={styles.cardGenre}>
						<Text style={styles.cardGenreItem}>Action</Text>
					</View>
					<View style={styles.cardNumbers}>
						<View style={styles.cardStar}>
							<Text style={styles.cardStarRatings}>* 8.9</Text>
						</View>
						<Text style={styles.cardRunningHours} />
					</View>
				</View>
 			</View>
			<Text style={styles.cardDescription} numberOfLines={3}>
				{movie.overview}
			</Text>
			<CastComponent cast={cast} navigation={navigation} />
		</ScrollView>
    )
};

const styles = StyleSheet.create({
	screen: {
		padding: 10,
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

export const PersonScreen =  withMovieContext(PersonScreenComponent);
