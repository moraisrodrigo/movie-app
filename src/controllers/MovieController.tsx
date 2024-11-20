import { Component, ComponentType, createContext, FunctionComponent, ReactNode } from "react";
import axios from "axios";
import { movieCredits, movieDetails, movieSimilar, moviesUrl } from "../services/movies";
import { MoviesListRequest } from "../types/requests";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Movie, SectionKey } from "../types/movie";
import { setSelectedMovie } from "../slicers/movieSlice";
import { MovieCreditsResponse, MovieDetails, MoviesListResponse } from "../types/responses";


interface OwnProps {
    children: ReactNode;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispachToProps>;

class MovieController extends Component<Props> {
    state = {}

    getMoviesList = async (section: SectionKey, request: MoviesListRequest): Promise<MoviesListResponse | null> => {
        try {
            const { data } = await axios.get<MoviesListResponse>(moviesUrl(section, { ...request }));

            return data;
        } catch (e) {
            console.warn("error fetching movies: ", JSON.parse(JSON.stringify(e)))
            return null;
        }
    }

    getMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
        try {
            const { data } = await axios.get<MovieDetails>(movieDetails(movieId));
            return data;
        } catch (e) {
            console.warn("error fetching movies: ", JSON.parse(JSON.stringify(e)))
            return null;
        }

    }
    getMovieCredits = async (movieId: number): Promise<MovieCreditsResponse | null> => {
        try {
            const { data } = await axios.get<MovieCreditsResponse>(movieCredits(movieId));
            return data;
        } catch (e) {
            console.warn("error fetching movies: ", JSON.parse(JSON.stringify(e)))
            return null;
        }

    }
    getSimilarMovies = async (movieId: number): Promise<MoviesListResponse | null> => {
        try {
            const { data } = await axios.get<MoviesListResponse>(movieSimilar(movieId));
            return data;
        } catch (e) {
            console.warn("error fetching movies: ", JSON.parse(JSON.stringify(e)))
            return null;
        }

    }

    render(): ReactNode {
        const { children, selectedMovie } = this.props;

        return (
            <Provider
                value={{
                    selectedMovie,
                    getMoviesList: this.getMoviesList,
                    getMovieDetails: this.getMovieDetails,
                    getMovieCredits: this.getMovieCredits,
                    getSimilarMovies: this.getSimilarMovies,
                }}
            >
                {children}
            </Provider>
        )
    }
}

const mapStateToProps = ({ movie}: RootState) => ({
    selectedMovie: movie.selectedMovie
});

const mapDispachToProps = (dispatch: AppDispatch) => ({
    dispatchSetSelectedMovie: (selectedMovie: Movie | null) => dispatch(setSelectedMovie(selectedMovie))
});

const ConnectedMovieController = connect(mapStateToProps, mapDispachToProps)(MovieController);

interface MovieContext extends Omit<InstanceType<typeof MovieController>, keyof Component> {
    selectedMovie: Movie | null;
}

const { Consumer, Provider } = createContext<MovieContext | null>(null);

const withMovieContext = <P extends object>(Component: ComponentType<P>): FunctionComponent<Omit<P, keyof MovieContext>> => (props) => (
    <ConnectedMovieController>
        <Consumer>
            {(context) => <Component {...props as P} {...context} />}
        </Consumer>
    </ConnectedMovieController>
);

export { withMovieContext };

export type { MovieContext }