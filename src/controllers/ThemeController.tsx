import { Component, ComponentType, createContext, FunctionComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { AppTheme } from "../types/theme";
import { setTheme } from "../slicers/preferencesSlice";

interface OwnProps {
    children: ReactNode;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispachToProps>;

class ThemeController extends Component<Props> {
    state = {}

    setTheme = (newTheme: AppTheme) => {
        const { dispatchSetTheme } = this.props;
        dispatchSetTheme(newTheme);
    }

    render(): ReactNode {
        const { children, theme } = this.props;

        return (
            <Provider
                value={{
                    theme,
                    setTheme: this.setTheme,
                }}
            >
                {children}
            </Provider>
        )
    }
}

const mapStateToProps = ({ preferences }: RootState) => ({
    theme: preferences.theme,
});

const mapDispachToProps = (dispatch: AppDispatch) => ({
    dispatchSetTheme: (theme: AppTheme) => dispatch(setTheme(theme)),
});

const ConnectedPersonController = connect(mapStateToProps, mapDispachToProps)(ThemeController);

interface ThemeContext extends Omit<InstanceType<typeof ThemeController>, keyof Component> {
    theme: AppTheme;
}

const { Consumer, Provider } = createContext<ThemeContext | null>(null);

const withThemeContext = <P extends object>(Component: ComponentType<P>): FunctionComponent<Omit<P, keyof ThemeContext>> => (props) => (
    <ConnectedPersonController>
        <Consumer>
            {(context) => <Component {...props as P} {...context} />}
        </Consumer>
    </ConnectedPersonController>
);

export { withThemeContext };

export type { ThemeContext }