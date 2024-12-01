import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons  } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppRoute, RootStackParamList } from './src/constants/routes';
import { SearchScreen } from './src/components/screens/SearchScreen';
import { ProfileScreen } from './src/components/screens/ProfileScreen';
import { PersonScreen } from './src/components/screens/PersonScreen';
import { store, persistor } from './src/store';
import { MoviesListScreen } from './src/components/screens/MoviesListScreen';
import { MovieScreen } from './src/components/screens/MovieScreen';
import { setup } from './src/api';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getSessionId } from './src/secureStore';

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
        case AppRoute.Search:
            title = 'Search'
        break;
        case AppRoute.SearchWrapper:
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
    }
    return <Text style={{ color: '#FFF' }}>{title}</Text>
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

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();
const { Navigator: StackNavigator, Screen: StackScreen } = createNativeStackNavigator<RootStackParamList>()

const App: FunctionComponent = () => {
    const [isPrepared, setIsPrepared] = useState(false);

    const sessionId = getSessionId();

    const prepare = () => {
        setup(sessionId);
        setIsPrepared(true);
    }

    useEffect(() => {
        prepare();
    }, [sessionId]);

    if (!isPrepared) return <></>;

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

    return (
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <StatusBar barStyle="light-content" />
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
                        <Screen name={AppRoute.MovieWrapper} component={MoviesWrapper} />
                        <Screen name={AppRoute.SearchWrapper} component={SearchWrapper} />
                        <Screen name={AppRoute.Profile} component={ProfileScreen} />
                    </Navigator>
                </NavigationContainer>
            </Provider>
        </PersistGate>
    );
}

export default App;
