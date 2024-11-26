import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { MovieContext, withMovieContext } from "../../controllers/MovieController";
import { Movie } from "../../types/movie";
import { Card } from "../elements/Card";
import { MoviesListResponse } from "../../types/responses";

interface Props extends MovieContext {
    getMovies: (page: number) => Promise<MoviesListResponse | null>;
	onMovieClick: (movie: Movie) => void;
}

const initialList: MoviesListResponse = {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0
}

const MoviesListComponent: FunctionComponent<Props> = (props: Props) => {
    const { getMovies, onMovieClick } = props;

    const [moviesList, setMoviesList] = useState<MoviesListResponse>(initialList);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        prepare();
    }, []);

    const prepare = async () => {        
        if (isLoading) return;

        setIsLoading(true);

        const { page, results } = moviesList;

        const data: MoviesListResponse | null = await getMovies(page + 1 );
    
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

    const renderCard = useCallback(({ item, index }: ListRenderItemInfo<Movie>) => (
        <Card movie={item} key={`${index}-${item.id}`} onClick={onMovieClick} />
    ), []);


    return (
        <FlatList
            horizontal={true}
            scrollEnabled={true}
            style={styles.horizontalList}
            data={moviesList.results}
            renderItem={renderCard}
            onEndReachedThreshold={0.3}
            onEndReached={prepare}
            keyExtractor={(movie) => String(`${movie.id}`)}
        />
    );
}

const styles = StyleSheet.create({
    horizontalList: {
        flex: 1,
        display: "flex",
        marginVertical: 15,
    }
});

export const MoviesList = withMovieContext(MoviesListComponent);