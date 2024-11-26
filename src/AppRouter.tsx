import { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons  } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppRoute, RootStackParamList } from './constants/routes';
import { HomeScreen } from './components/screens/HomeScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { MoviesScreen } from './components/screens/MoviesScreen';
import { MovieScreen } from './components/screens/MovieScreen';
import { setup } from './api';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthenticationContext, withAuthenticationContext } from './controllers/AuthenticationController';
import { getSessionId } from './secureStore';

type TabBarIconProps = { 
    focused: boolean;
    color: string;
    size: number;
}

const MyTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#111111',
        card: '#111111',
        text: '#FFF',
        primary: 'rgb(255, 45, 85)',
    },
};

const getTitle = (route: string): ReactNode => {
    let title: string = 'Movie App';
    switch (route) {
        case AppRoute.Home:
            title = 'Home'
        break;
        case AppRoute.Profile:
            title = 'Profile'
        break;
        case AppRoute.Movie:
            title = 'Details'
        break;
        case AppRoute.MovieWrapper:
        case AppRoute.MoviesList:
            title = 'Movies'
        break;
        case AppRoute.NotFound:
            title = 'Ups! Not found'
        break;
    }
    return <Text style={{ color: '#FFF' }}>{title}</Text>
}

const getTabBarIcon = ({ focused, color, size }: TabBarIconProps, routeName: string): ReactNode => {
    const commonProps = { size, color, focused };

    switch (routeName) {
        case AppRoute.Profile:
            return <AntDesign name="user" { ...commonProps } />;
        case AppRoute.Movie:
            return <MaterialCommunityIcons name="movie" { ...commonProps } />;
            case AppRoute.MovieWrapper:
                case AppRoute.MoviesList:
            return <MaterialCommunityIcons name="movie-search" { ...commonProps } />;
        case AppRoute.Home:
            return <MaterialCommunityIcons name="home" { ...commonProps } />;
    }
}

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();
const { Navigator: StackNavigator, Screen: StackScreen } = createNativeStackNavigator<RootStackParamList>()

type Props = AuthenticationContext; 

const AppRouterComponent: FunctionComponent<Props> = (props: Props) => {
    const {
        authenticatedUser,
    } = props;

    const [isPrepared, setIsPrepared] = useState(false); 

    const prepare = async () => {
        const sessionId = await getSessionId();
        
        setup(sessionId);
        setIsPrepared(true);
    }

    useEffect(() => {
        prepare();
    }, [authenticatedUser]);

    if (!isPrepared) return <></>;

    const MoviesWrapper = (): ReactNode => {
        return (
           <StackNavigator screenOptions={{ headerShown: false }} initialRouteName={AppRoute.MoviesList}>
              <StackScreen name={AppRoute.MoviesList} component={MoviesScreen} />
              <StackScreen name={AppRoute.Movie} component={MovieScreen} />
           </StackNavigator>
        );
     }

    return (
        <NavigationContainer theme={MyTheme}>
            <Navigator
                initialRouteName={AppRoute.MovieWrapper}
                screenOptions={({ route: { name: routeName } }) => ({
                    headerShown: false,
                    tabBarLabel: ({ children }) => getTitle(children),
                    headerTitle: ({ children }) => getTitle(children),
                    tabBarIcon: (props) => getTabBarIcon(props, routeName),
                })}
            >
                <Screen name={AppRoute.Home} component={HomeScreen} />
                <Screen name={AppRoute.MovieWrapper} component={MoviesWrapper} />
                <Screen name={AppRoute.Profile} component={ProfileScreen} />
            </Navigator>
        </NavigationContainer>   
    );
}

export const AppRouter = withAuthenticationContext(AppRouterComponent);
