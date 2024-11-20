import { FunctionComponent } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Cast } from '../../types/responses'
import { fallbackPersonImage } from '../../constants/misc'
import { image185 } from '../../services/movies'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppRoute, RootStackParamList } from '../../constants/routes'

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, AppRoute.Movie, undefined>
    cast: Cast[]
}

const CastComponent: FunctionComponent<Props> = (props: Props) => {

    const { cast, navigation } = props;

    return (
        <View
        style={styles.view}
        // className="my-6"
        >
            <Text style={styles.topCastTitle}>Top Cast</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}>
                {cast && cast.map(({ character, original_name, profile_path }, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.person}
                    >
                        <View>
                            <Image
                                style={styles.avatar}
                                source={{ uri: image185(profile_path) || fallbackPersonImage }}
                            />
                        </View>
                        <Text style={{ color: 'white' }}>
                            {character.length > 10 ? character.slice(0, 10) + '...' : character}
                        </Text>
                        <Text style={{ color: 'white' }}>
                            {original_name.length > 10 ? original_name.slice(0, 10) + '...' : original_name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        marginVertical: 10,
    },
	avatar: {
        borderRadius: 800,
        height: 30,
        width: 30,
    },
    person: {
        alignItems: 'center',
        margin: 10,
    },
    topCastTitle: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export { CastComponent }