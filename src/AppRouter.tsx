import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { DefaultTheme, getFocusedRouteNameFromRoute, NavigationContainer, RouteProp, Theme, DarkTheme } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons  } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppRoute, RootStackParamList } from './constants/routes';
import { SearchScreen } from './components/screens/SearchScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { PersonScreen } from './components/screens/PersonScreen';
import { MoviesListScreen } from './components/screens/MoviesListScreen';
import { MovieScreen } from './components/screens/MovieScreen';
import { StatusBar, StyleProp, Text, TextStyle } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast, { BaseToast, ErrorToast, ToastConfig, BaseToastProps} from 'react-native-toast-message';
import { ThemeContext, withThemeContext } from './controllers/ThemeController';
import { AppTheme } from './types/theme';

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
}

type OwnProps = ThemeContext;

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();
const { Navigator: StackNavigator, Screen: StackScreen } = createNativeStackNavigator<RootStackParamList>()

const AppRouterComponent: FunctionComponent<OwnProps> = (props: OwnProps) => {
    const { theme } = props;

    const [navigatorTheme, setNavigatorTheme] = useState<Theme>();

    useEffect(() => {
        const isDarkTheme: boolean = theme === AppTheme.Dark;
        const defaultTheme = isDarkTheme ? DarkTheme : DefaultTheme;

        setNavigatorTheme({
            ...defaultTheme,
            colors: {
                ...defaultTheme.colors,
                background: isDarkTheme ? '#111111' : '#F7F7F7',
                text: isDarkTheme ? '#FFFFFF' : '#000000',
                card: isDarkTheme ? '#111111' : '#F7F7F7',
                primary: 'rgb(255, 45, 85)',
            },
            dark: isDarkTheme,
        })
    }, [theme]);

    const getTitle = (route: RouteProp<RootStackParamList, keyof RootStackParamList>, routeDefault: string): ReactNode => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? routeDefault;

        let title: string = 'Movie App';

        switch (routeName) {
            case AppRoute.Search:
            case AppRoute.SearchWrapper:
                title = 'Search'
            break;
            case AppRoute.Profile:
                title = 'Profile'
            break;
            case AppRoute.Person:
                title = 'Person';
            break;
            case AppRoute.Movie:
                title = 'Details'
            break;
            case AppRoute.MovieWrapper:
            case AppRoute.MoviesList:
                title = 'Movies'
            break;
        }

        return <Text style={{ color: theme === AppTheme.Dark ? '#F7F7F7' : '#000000', }}>{title}</Text>
    }

    const getTabBarIcon = ({ focused, color, size }: TabBarIconProps, routeName: string): ReactNode => {
        const commonProps = { size, color, focused };

        switch (routeName) {
            case AppRoute.Profile:
                return <AntDesign name="user" { ...commonProps } />;
            case AppRoute.Movie:
                return <MaterialCommunityIcons name="movie-play" { ...commonProps } />;
            case AppRoute.MovieWrapper:
            case AppRoute.MoviesList:
                return <MaterialCommunityIcons name="movie" { ...commonProps } />;
            case AppRoute.SearchWrapper:
            case AppRoute.Search:
                return <AntDesign name="search1" { ...commonProps } />;
        }

        return <AntDesign name="user" { ...commonProps } />;
    }

    const MoviesWrapper = (): ReactNode => {
        return (
            <StackNavigator screenOptions={{ headerShown: false }} initialRouteName={AppRoute.MoviesList}>
                <StackScreen name={AppRoute.MoviesList} component={MoviesListScreen} />
                <StackScreen name={AppRoute.Movie} component={MovieScreen} />
                <StackScreen name={AppRoute.Person} component={PersonScreen} />
            </StackNavigator>
        );
    }

    const SearchWrapper = (): ReactNode => {
        return (
           <StackNavigator screenOptions={{ headerShown: false }} initialRouteName={AppRoute.Search}>
                <Screen name={AppRoute.Search} component={SearchScreen} />
                <StackScreen name={AppRoute.Movie} component={MovieScreen} />
                <StackScreen name={AppRoute.Person} component={PersonScreen} />
           </StackNavigator>
        );
    }

    const toastStyle: StyleProp<TextStyle> = {
        color: theme === AppTheme.Dark ? 'white' : '#111111',
        backgroundColor:  theme === AppTheme.Dark ? '#111111' : 'white',
    }

    const toastProps: BaseToastProps = {
        contentContainerStyle: toastStyle,
        text1Style: toastStyle,
        text2Style: toastStyle,
    }

    const toastConfig: ToastConfig = {
        success: (props) => <BaseToast {...{...props, ...toastProps}} style={{ borderLeftColor: '#3ac9b0' }} />,
        error: (props) => <ErrorToast {...{...props, ...toastProps}} style={{ borderLeftColor: '#c01c28' }} />,
    };

    return (
        <>
            <StatusBar barStyle={theme === AppTheme.Light ? 'dark-content' : 'light-content' } />
            <NavigationContainer theme={navigatorTheme}>
                <Navigator
                    initialRouteName={AppRoute.MovieWrapper}
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarLabel: ({ children }) => getTitle(route, children),
                        tabBarIcon: (props) => getTabBarIcon(props, route.name),
                    })}
                >
                    <Screen name={AppRoute.MovieWrapper} component={MoviesWrapper} />
                    <Screen name={AppRoute.SearchWrapper} component={SearchWrapper} />
                    <Screen name={AppRoute.Profile} component={ProfileScreen} />
                </Navigator>
            </NavigationContainer>
            <Toast config={toastConfig}/>
        </>
    );
}

export const AppRouter = withThemeContext(AppRouterComponent);
