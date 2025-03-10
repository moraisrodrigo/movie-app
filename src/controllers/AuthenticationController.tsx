import { Component, ComponentType, createContext, FunctionComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { openBrowserAsync } from 'expo-web-browser';
import { AppDispatch, RootState } from "../store";
import { setAuthenticatedUser } from "../slicers/authenticationSlice";
import { User } from "../types/user";
import { accountUrl, authenticateUrl, createRequestTokenUrl, createSessionUrl, deleteSessionUrl } from "../services/authentication";
import axios from "axios";
import { RequestTokenCreate, SessionCreate } from "../types/authentication";
import { getSessionId, setSessionId } from "../secureStore";
import { setup } from "../api";
import { MoviesListResponse, PersonalResponse } from "../types/responses";
import { favouriteMoviesUrl, updateFavouriteMoviesUrl, updatewatchlistMoviesUrl, watchlistMoviesUrl } from "../services/movies";
import { ListParams, MovieFavouriteRequest, MovieWatchListRequest } from "../types/requests";
import { Movie } from "../types/movie";


interface OwnProps {
    children: ReactNode;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispachToProps>;

class AuthenticationController extends Component<Props> {
    state = {}

    login = async () => {
        const { dispatchSetAuthenticatedUser } = this.props;
        try {
            const { data: { request_token } } = await axios.get<RequestTokenCreate>(createRequestTokenUrl());

            await openBrowserAsync(authenticateUrl(request_token));

            const { data: { session_id } } = await axios.post<SessionCreate>(createSessionUrl(), { request_token });

            setup(session_id);

            await setSessionId(session_id);

            const { data } = await axios.get<User>(accountUrl());

            dispatchSetAuthenticatedUser({ ...data })

        } catch {
            setSessionId(null);
            dispatchSetAuthenticatedUser(null)
            return null;
        }
    }

    logout = async () => {
        const { dispatchSetAuthenticatedUser } = this.props;
        try {
            dispatchSetAuthenticatedUser(null)

            const sessionId = getSessionId();

            await axios.delete(deleteSessionUrl(), { data: { session_id: sessionId } });

            setSessionId(null)

        } catch(error) {
            return null;
        }
    }

    getFavouriteMovies = async (request: ListParams): Promise<MoviesListResponse | null> => {
        const { authenticatedUser } = this.props;

        if (!authenticatedUser) return null;

        try {
            const { data } = await axios.get<MoviesListResponse>(favouriteMoviesUrl(String(authenticatedUser.id), request));

            return data;
        } catch (e) {
            return null;
        }
    }

    getWatchListMovies = async (request: ListParams): Promise<MoviesListResponse | null> => {
        const { authenticatedUser } = this.props;

        if (!authenticatedUser) return null;

        try {
            const { data } = await axios.get<MoviesListResponse>(watchlistMoviesUrl(String(authenticatedUser.id), request));

            return data;
        } catch (e) {
            return null;
        }
    }

    updateMovieFavourite = async (movie: Movie, isFavourite: boolean): Promise<PersonalResponse> => {
        const response: PersonalResponse = { success: false };

        const { authenticatedUser } = this.props;

        if (!authenticatedUser) return response;

        try {

            const request: MovieFavouriteRequest = {
                media_type: "movie",
                media_id: movie.id,
                favorite: isFavourite,
            }

            const { data } = await axios.post<PersonalResponse>(updateFavouriteMoviesUrl(String(authenticatedUser.id)), { ...request });

            return data;
        } catch {
            return response;
        }
    }

    updateMovieWatchlist = async (movie: Movie, addToWatchList: boolean): Promise<PersonalResponse> => {
        const response: PersonalResponse = { success: false };

        const { authenticatedUser } = this.props;

        if (!authenticatedUser) return response;

        try {

            const request: MovieWatchListRequest = {
                media_type: "movie",
                media_id: movie.id,
                watchlist: addToWatchList,
            }

            const { data } = await axios.post<PersonalResponse>(updatewatchlistMoviesUrl(String(authenticatedUser.id)), { ...request });

            return data;
        } catch {
            return response;
        }
    }

    render(): ReactNode {
        const { children, authenticatedUser } = this.props;

        return (
            <Provider
                value={{
                    authenticatedUser,
                    login: this.login,
                    logout: this.logout,
                    getFavouriteMovies: this.getFavouriteMovies,
                    getWatchListMovies: this.getWatchListMovies,
                    updateMovieFavourite: this.updateMovieFavourite,
                    updateMovieWatchlist: this.updateMovieWatchlist,
                }}
            >
                {children}
            </Provider>
        )
    }
}

const mapStateToProps = ({ authentication }: RootState) => ({
    authenticatedUser: authentication.authenticatedUser,
});

const mapDispachToProps = (dispatch: AppDispatch) => ({
    dispatchSetAuthenticatedUser: (authenticatedUser: User | null) => dispatch(setAuthenticatedUser(authenticatedUser)),
});

const ConnectedMovieController = connect(mapStateToProps, mapDispachToProps)(AuthenticationController);

interface AuthenticationContext extends Omit<InstanceType<typeof AuthenticationController>, keyof Component> {
    authenticatedUser: User | null;
}

const { Consumer, Provider } = createContext<AuthenticationContext | null>(null);

const withAuthenticationContext = <P extends object>(Component: ComponentType<P>): FunctionComponent<Omit<P, keyof AuthenticationContext>> => (props) => (
    <ConnectedMovieController>
        <Consumer>
            {(context) => <Component {...props as P} {...context} />}
        </Consumer>
    </ConnectedMovieController>
);

export { withAuthenticationContext };

export type { AuthenticationContext }