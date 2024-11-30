import { Component, ComponentType, createContext, FunctionComponent, ReactNode } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Person } from "../types/user";
import { personMoviesUrl, personUrl } from "../services/person";
import { PersonMovies } from "../types/responses";
import { Movie } from "../types/movie";


interface OwnProps {
    children: ReactNode;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispachToProps>;

class PersonController extends Component<Props> {
    state = {}

    getPersonDetails = async (personId: string): Promise<Person | null> => {
        try {
            const { data } = await axios.get<Person>(personUrl(personId));
            return data;
        } catch (e) {
            return null;
        }
    }

    getPersonMovies = async (personId: string): Promise<Movie[]> => {
        try {
            const { data: { cast } } = await axios.get<PersonMovies>(personMoviesUrl(personId));
            return cast;
        } catch (e) {
            return [];
        }
    }

    render(): ReactNode {
        const { children } = this.props;

        return (
            <Provider
                value={{
                    getPersonDetails: this.getPersonDetails,
                    getPersonMovies: this.getPersonMovies,
                }}
            >
                {children}
            </Provider>
        )
    }
}

const mapStateToProps = ({}: RootState) => ({
});

const mapDispachToProps = ({}: AppDispatch) => ({
});

const ConnectedPersonController = connect(mapStateToProps, mapDispachToProps)(PersonController);

interface PersonContext extends Omit<InstanceType<typeof PersonController>, keyof Component> {
}

const { Consumer, Provider } = createContext<PersonContext | null>(null);

const withPersonContext = <P extends object>(Component: ComponentType<P>): FunctionComponent<Omit<P, keyof PersonContext>> => (props) => (
    <ConnectedPersonController>
        <Consumer>
            {(context) => <Component {...props as P} {...context} />}
        </Consumer>
    </ConnectedPersonController>
);

export { withPersonContext };

export type { PersonContext }