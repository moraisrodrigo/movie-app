import { FunctionComponent, ReactNode } from "react";
import { AntDesign  } from '@expo/vector-icons';
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProfileRouteParams } from "../../constants/routes";
import { AuthenticationContext, withAuthenticationContext } from "../../controllers/AuthenticationController";
import { image500 } from "../../services/movies";

type Props = ProfileRouteParams & AuthenticationContext;

const ProfileScreenComponent: FunctionComponent<Props> = (props: Props) => {
    const {  
        authenticatedUser, 
        login,
        logout
    } = props;

    const renderAvatar = (): ReactNode => {
        if (!authenticatedUser) return null;

        const { avatar: { tmdb: tmdbAvatar } } = authenticatedUser;

        const avatarPath = tmdbAvatar.avatar_path ? image500(tmdbAvatar.avatar_path) : null;

        if (avatarPath) return <Image source={{ uri: avatarPath }} style={styles.avatarImage} />;

        return <AntDesign name="user" size={80} color="white" style={styles.avatarFallback} />;
    };

    const renderAuthUser = (): ReactNode => {
        if (!authenticatedUser) return null;

        const { username, name, iso_639_1, iso_3166_1, include_adult } = authenticatedUser;

        return (
            <>
                {renderAvatar()}
                <Text style={styles.profileName}>{name || username}</Text>
                <View style={styles.userDetailsWrapper}>
                    <Text style={styles.userDetails}>Username: {username}</Text>
                    <Text style={styles.userDetails}>Language: {iso_639_1}</Text>
                    <Text style={styles.userDetails}>Region: {iso_3166_1}</Text>
                    <Text style={styles.userDetails}>Include Adult: {include_adult ? "Yes" : "No"}</Text>
                </View>
                <Button title="Logout" onPress={logout} />
            </>
        );
    }

    const renderNonAuthUser = (): ReactNode => {
        return (
            <View style={styles.nonAuthWrapper}>
                <Text style={styles.nonAuth}>Login with your account</Text>
                <Button title="Login" onPress={login} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.screen}>
                {authenticatedUser ? renderAuthUser() : renderNonAuthUser()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
	container: {
        flex: 1,
        height: '100%'
    },
    screen: {
        padding: 20,
        alignItems: 'center',
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    avatarFallback: {
        marginBottom: 10,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF',
    },
    userDetailsWrapper: {
        marginBottom: 20,
        width: '100%',
        alignItems: "flex-start"
    },
    userDetails: {
        color: '#FFFFFF',
    },
    nonAuthWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    nonAuth: {
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: 10,
    },
});

export const ProfileScreen = withAuthenticationContext(ProfileScreenComponent);