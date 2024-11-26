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

    const { cast } = props;

    const renderName = (name: string): string => name.length > 10 ? name.slice(0, 10) + '...' : name;

    const renderCast = ({ character, original_name, profile_path }: Cast, index: number) => (
        <TouchableOpacity
            key={index}
            style={styles.person}
        >
            <Image
                style={styles.avatar}
                source={{ uri: image185(profile_path) || fallbackPersonImage }}
            />
            <Text style={styles.name} >
                {renderName(character)}
            </Text>
            <Text style={styles.name} >
                {renderName(original_name)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.view}>
            <Text style={styles.topCastTitle}>Top Cast</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}>
                {cast && cast.map(renderCast)}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        marginVertical: 10,
    },
	avatar: {
        borderRadius: '50%',
        height: 60,
        width: 60,
    },
    person: {
        alignItems: 'center',
        margin: 10,
    },
    topCastTitle: {
        color: 'white',
        fontWeight: 'bold'
    },
    name: {
        color: 'white'
    }
});

export { CastComponent }