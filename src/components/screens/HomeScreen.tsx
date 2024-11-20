import { FunctionComponent } from "react";
import { Button, Text, View } from "react-native";
import { AppRoute, HomeRouteParams } from "../../constants/routes";

type Props = HomeRouteParams;

const HomeScreen: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate } } = props;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <Button
                title="nova pagina"
                onPress={() => navigate(AppRoute.MoviesList)}
            />
            <Text>Home Screen</Text>
        </View>
    );
}

export { HomeScreen };