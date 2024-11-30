import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { PersonContext, withPersonContext } from '../../controllers/PersonController';
import { Person } from '../../types/user';
import { AppRoute, PersonRouteParams } from '../../constants/routes';
import { Spinner } from '../elements/Spinner';
import { image342 } from '../../services/movies';
import { fallbackPersonImage } from '../../constants/misc';
import { MoviesList } from '../elements/MoviesList';
import { MoviesListResponse } from '../../types/responses';
import { Movie } from '../../types/movie';

interface Props extends PersonRouteParams, PersonContext { }

const PersonScreenComponent: FunctionComponent<Props> = (props: Props) => {
	const {
		route: {
			params: {
				personId,
			}
		},
		navigation,
		getPersonDetails,
		getPersonMovies,
	} = props;

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [person, setPerson] = useState<Person | null>(null);

	const onMovieClick = (movie: Movie): void => navigation.navigate(AppRoute.Movie, { movie });

	const getMovies = async (): Promise<MoviesListResponse> => {
		const results: Movie[] = await getPersonMovies(personId);

		return {
			page: 0,
			results,
			total_pages: 1,
			total_results: results.length
		}
	};

	const prepare = async (): Promise<void> => {
        const personDetails: Person | null = await getPersonDetails(personId);		

		setPerson(personDetails);
		setIsLoading(false);
	};

	const renderMovies = (): ReactNode => {
        return (
            <ScrollView style={styles.moviesWrapper}>
                <MoviesList
					title='Movies'
                    onMovieClick={onMovieClick}
                    getMovies={getMovies}
                />
            </ScrollView>
        );
    };

	useEffect(() => {
		prepare();
	}, []);

	if (isLoading || !person) return <Text style={{ backgroundColor: '#FF0000' }}>asd</Text>
	if (isLoading || !person) return <Spinner />

	return (
		<SafeAreaView>
			<ScrollView style={styles.screen}>
				<View style={styles.secondContainer}>
					<Image
					style={styles.imageView}
					source={{ uri: image342(person.profile_path) || fallbackPersonImage }}
					/>
					<View style={{ flexWrap: "wrap", flex: 1 }}>
					<View style={styles.artistInfoContainer}>
						<Text style={[ styles.artistName, { color:'white' }]}>
						{person.name}
						</Text>
						<View style={styles.otherInfoContainer}>
						<Text style={[ styles.titleContent, { color:'white' }]}>
							known for
						</Text>
						<Text style={[ styles.titleData, { color:'white' }]}>
							{person.known_for_department}
						</Text>
						</View>
						<View style={styles.otherInfoContainer}>
						<Text style={[ styles.titleContent, { color:'white' }]}>
							Gender
						</Text>
						<Text style={[ styles.titleData, { color:'white' }]}>
							{person.gender === 1 ? "Female" : "Male"}
						</Text>
						</View>
						<View style={styles.otherInfoContainer}>
						<Text style={[ styles.titleContent, { color:'white' }]}>
							Birthday
						</Text>
						<Text
							style={[ styles.titleData, { color:'white' }]}>
							{person.birthday}
						</Text>
						</View>
						<View style={styles.otherInfoContainer}>
						<Text style={[ styles.titleContent, { color:'white' }]} >
							Place of Birth
						</Text>
						<Text style={[ styles.titleData, { color:'white' }]}>
							{person.place_of_birth}
						</Text>
						</View>
					</View>
					</View>
				</View>
				{renderMovies()}
				<View style={styles.biographyWrapper}>
					<Text
						style={[styles.biography, { color:'white' }]}
					>
						Biography
					</Text>
					<Text style={{ color:'white' }}>
						{person.biography}
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	  );
};

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		marginBottom: 20,
	},
	moviesWrapper: {
	},
	mainView: {
	  	flex: 1,
	  	margin: 8,
	},
	imageView: {
	  	height: 300,
		width: 190,
		resizeMode: "stretch",
		borderRadius: 16,
	},
	secondContainer: {
		marginBottom: 16,
	  	flexDirection: "row",
	},
	artistInfoContainer: {
	  	paddingLeft: 16,
	},
	artistName: {
	  	fontSize: 24,
	},
	otherInfoContainer: {
	  	marginTop: 8,
	},
	titleContent: {
	  	fontSize: 13,
	},
	titleData: {
	  	fontSize: 16,
	},
	biography: {
	  	fontSize: 24,
		marginTop: 16,
		marginBottom: 8,
	},
	biographyWrapper: {
		marginBottom: 16,
	},
});

export const PersonScreen =  withPersonContext(PersonScreenComponent);
