import React, { ReactNode } from 'react';
import { DefaultTheme, NavigationContainer, Theme, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppRoute, RootStackParamList } from './src/constants/routes';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { store, persistor } from './src/store';
import { MoviesScreen } from './src/components/screens/MoviesScreen';
import { MovieScreen } from './src/components/screens/MovieScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
        case AppRoute.Movie:
            title = 'Details'
        break;
        case AppRoute.MoviesList:
            title = 'Movies'
        break;
        case AppRoute.NotFound:
            title = 'Ups! Not found'
        break;
    }
    return <Text style={{ color: '#FFF' }}>{title}</Text>
}

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();
const { Navigator: StackNavigator, Screen: StackScreen } = createNativeStackNavigator<RootStackParamList>()

const App: React.FC = () => {

    const MoviesNav = (): ReactNode => {
        return (
           <StackNavigator initialRouteName={AppRoute.MoviesList}>
              <StackScreen name={AppRoute.MoviesList} component={MoviesScreen} />
              <StackScreen name={AppRoute.Movie} component={MovieScreen} />
           </StackNavigator>
        );
     }

    return (
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <NavigationContainer theme={MyTheme}>
                    <Navigator initialRouteName={AppRoute.MovieWrapper} screenOptions={{ headerTitle: ({ children }) => getTitle(children)}}>
                        <Screen name={AppRoute.Home} component={HomeScreen} />
                        <Screen name={AppRoute.MovieWrapper} component={MoviesNav} />
                    </Navigator>
                </NavigationContainer>
            </Provider>
        </PersistGate>
    );
}

export default App;
