import { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';
import { Movie } from '../../types/movie';
import { TMDB_IMG_URL } from '../../settings';

interface Props {
    movie: Movie;
	onClick: (movie: Movie) => void;
}

const Card: FunctionComponent<Props> = ({ movie, onClick }: Props) => (
    <TouchableOpacity
		style={styles.cardContainer}
		activeOpacity={0.9}
		onPress={() => onClick(movie)}
	>
        <Image source={{ uri: `${TMDB_IMG_URL}/w185/${movie.poster_path}` }} style={styles.cardImage} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
	cardContainer: {
		display: 'flex',
        marginHorizontal: 5,
	},
	cardImage: {
		height: 163,
		width: 120,
		borderRadius: 4,
	},
});

export { Card };