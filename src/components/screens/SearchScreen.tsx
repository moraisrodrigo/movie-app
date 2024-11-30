import { FunctionComponent } from "react";
import { Button, Text, View } from "react-native";
import { AppRoute, SearchRouteParams } from "../../constants/routes";

type Props = SearchRouteParams;

const SearchScreen: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate } } = props;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <Button
                title="nova pagina"
                onPress={() => navigate(AppRoute.MovieWrapper, { screen: AppRoute.MoviesList })}
            />
            <Text>Home Screen</Text>
        </View>
    );
}

export { SearchScreen };