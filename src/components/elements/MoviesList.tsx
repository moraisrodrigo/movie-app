import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";
import { Movie, SectionKey } from "../../types/movie";
import { Card } from "../elements/Card";
import { MoviesListResponse } from "../../types/responses";

interface Props extends MovieContext {
    sectionKey: SectionKey;
	onMovieClick: (movie: Movie) => void;
}

const initialList: MoviesListResponse = {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0
}

const MoviesListComponent: FunctionComponent<Props> = (props: Props) => {
    const { getMoviesList, sectionKey, onMovieClick } = props;

    const [moviesList, setMoviesList] = useState<MoviesListResponse>(initialList);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        prepare();
    }, []);

    const prepare = async () => {        
        if (isLoading) return;

        setIsLoading(true);

        const { page, results } = moviesList;

        const data: MoviesListResponse | null = await getMoviesList(sectionKey, { page: page + 1 });
    
        setIsLoading(false);
    
        if (!data) return;
    
        // Filter out duplicates based on the existing IDs in this specific section
        const existingIds: Set<number> = new Set<number>(results.map(({ id }) => id));

        const uniqueMovies: Movie[] = data.results.filter(({ id }) => !existingIds.has(id));
    
        setMoviesList((prevState) => ({
            ...prevState,
            ...data,
            results: [...prevState.results, ...uniqueMovies],
        }));
    };

    const renderCard = useCallback(({ item, index }: ListRenderItemInfo<Movie>) => (
        <Card movie={item} key={`${index}-${sectionKey}`} onClick={onMovieClick} />
    ), []);

    

    const renderTitle = () => {
        let title: string = 'Movies';

        switch (sectionKey) {
            case SectionKey.NOW_PLAYING:
                title = "NOW_PLAYING"
                break;
            case SectionKey.POPULAR:
                title = "POPULAR"
                break;
            case SectionKey.TOP_RATED:
                title = "TOP_RATED"
                break;
            case SectionKey.UPCOMING:
                title = "UPCOMING"
                break;
            default:
                break;
        }

        return (
            <Text style={styles.listTitle}>
                {title}
            </Text>
        );
    };


    return (
        <View>
            {renderTitle()}
            <FlatList
                horizontal={true}
                scrollEnabled={true}
                style={styles.horizontalList}
                data={moviesList.results}
                renderItem={renderCard}
                onEndReachedThreshold={0.3}
                onEndReached={prepare}
                keyExtractor={(movie) => String(`${movie.id}-${sectionKey}`)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
	mainCard: {
		padding: 10,
	},
    listTitle: {
        color: "#FFF"
    },
    horizontalList: {
        flex: 1,
        display: "flex",
        marginVertical: 20,
    }
});

export const MoviesList = withMovieContext(MoviesListComponent);