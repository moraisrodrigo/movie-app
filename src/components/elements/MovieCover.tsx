import { FunctionComponent, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Text, View } from 'react-native';
import { TMDB_IMG_URL } from '../../settings';
import { Genre, Movie } from '../../types/movie';
import { MovieContext, withMovieContext } from '../../controllers/MovieController';

interface Props extends MovieContext{
    movie: Movie;
	onClick?: () => void;
}

const MovieCoverComponent: FunctionComponent<Props> = (props: Props) => {
	const {
		movie: {
			genre_ids,
			backdrop_path,
			poster_path,
			original_title,
			vote_average
		},
		onClick,
		getGenres,
	} = props;	

	const [genre, setGenre] = useState<Genre>();

    useEffect(() => {
        prepare();
    }, []);

    const prepare = async () => {
        const genresList = await getGenres();

        const genreFound: Genre | undefined = genresList.find((genre: Genre) => genre.id === genre_ids[0]);

		setGenre(genreFound);
    }

	const Component = onClick ? TouchableOpacity : ScrollView

    return (
		<Component onPress={onClick}>
            <Image source={{ uri: `${TMDB_IMG_URL}/w780/${(backdrop_path || poster_path)}` }} style={styles.imageBackdrop} />
			<View style={styles.cardContainer}>
				<Image source={{ uri: `${TMDB_IMG_URL}/w185/${poster_path}` }} style={styles.cardImage} />
				<View style={styles.cardDetails}>
					<Text style={styles.cardTitle} numberOfLines={2}>
						{original_title}
					</Text>
					{genre && (
						<View style={styles.cardGenre}>
							<Text style={styles.cardGenreItem}>{genre.name}</Text>
						</View>
					)}
					<View style={styles.cardNumbers}>
						<View style={styles.cardStar}>
							<Text style={styles.cardStarRatings}>⭐️ {vote_average.toFixed(1)}/10</Text>
						</View>
						<Text style={styles.cardRunningHours} />
					</View>
				</View>
 			</View>
		</Component>
    )
};

const styles = StyleSheet.create({
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
		fontWeight: '800',
		paddingTop: 10
	},
	cardGenre: {
		flexDirection: 'row'
	},
	cardGenreItem: {
		fontWeight: '800',
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
		fontWeight: '800',
		fontSize: 12,
		color: 'white'
	},
	cardRunningHours: {
		marginLeft: 5,
		fontSize: 12
	},
});

export const MovieCover = withMovieContext(MovieCoverComponent);
