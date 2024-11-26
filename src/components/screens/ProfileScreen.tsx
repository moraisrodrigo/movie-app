import { FunctionComponent, ReactNode } from "react";
import { AntDesign  } from '@expo/vector-icons';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProfileRouteParams } from "../../constants/routes";
import { AuthenticationContext, withAuthenticationContext } from "../../controllers/AuthenticationController";

type Props = ProfileRouteParams & AuthenticationContext;

const ProfileScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const {  
        authenticatedUser, 
        login,
        logout
    } = props;

    const renderAuthUser = (): ReactNode => {
        return (
        <>
            <Text>estou authenticado {JSON.stringify(authenticatedUser)}</Text>
            <Button title="logout" onPress={logout} />
        </>
    )
    }

    const renderNonAuthUser = (): ReactNode => {
        return (
            <>
                <Button title="Login" onPress={login} />
            </>
        )
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.screen}>
                <View style={styles.avatarWrapper}>
                    <AntDesign
                        style={styles.avatar}
                        name="user"
                        size={56}
                        color="white"
                    />
                </View>
                {authenticatedUser ? renderAuthUser() : renderNonAuthUser()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	screen: {
		padding: 10,
        height: '100%',
	},
	avatarWrapper: {
        marginVertical: 30,
	},
	avatar: {
        textAlign: 'center',
	},
});

export const ProfileScreen = withAuthenticationContext(ProfileScreenComponent);