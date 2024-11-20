import { FunctionComponent } from "react";
import { Button, Text, View } from "react-native";
import { AppRoute, ProfileRouteParams } from "../../constants/routes";

type Props = ProfileRouteParams;

const ProfileScreen: FunctionComponent<Props> = (props: Props) => {
    const { navigation: { navigate } } = props;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <Button
                title="nova pagina"
                onPress={() => navigate(AppRoute.MovieWrapper, { screen: AppRoute.MoviesList })}
            />
            <Text>Profile Screen</Text>
        </View>
    );
}

export { ProfileScreen };