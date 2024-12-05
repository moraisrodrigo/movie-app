import { FunctionComponent } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Cast } from '../../types/responses'
import { fallbackPersonImage } from '../../constants/misc'
import { image185 } from '../../services/movies'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppRoute, RootStackParamList } from '../../constants/routes'
import { ThemeContext, withThemeContext } from '../../controllers/ThemeController'
import { AppTheme } from '../../types/theme'

type Props = ThemeContext & {
    navigation: NativeStackNavigationProp<RootStackParamList, AppRoute.Movie, undefined>
    cast: Cast[]
}

const CastElementComponent: FunctionComponent<Props> = (props: Props) => {

    const { cast, navigation: { navigate }, theme } = props;

	const styles = getStyles(theme === AppTheme.Dark);

    const onPersonClick = (personId: string) => navigate(AppRoute.Person, { personId })

    const renderName = (name: string): string => name.length > 10 ? name.slice(0, 10) + '...' : name;

    const renderCast = ({ character, original_name, profile_path, id }: Cast, index: number) => (
        <TouchableOpacity
            onPress={() => onPersonClick(String(id))}
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
        cast.length > 0 && (
            <View style={styles.view}>
                <View style={styles.titleWrapper}>
                    <View style={styles.line} />
                    <View>
                        <Text style={styles.title}>Top Cast</Text>
                    </View>
                    <View style={styles.line} />
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15 }}>
                    {cast.map(renderCast)}
                </ScrollView>
            </View>
        )
    );
}

const getStyles = (isDarkTheme: boolean) => StyleSheet.create({
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
    titleWrapper: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        flex: 1,
        height: 1,
        marginInline: 10,
        backgroundColor: '#FF214A'
    },
    title: {
        fontWeight: 'bold',
		color: isDarkTheme ? '#f7f7f7' : '#000000',
    },
    name: {
		color: isDarkTheme ? '#f7f7f7' : '#000000',
    }
});

export const CastComponent = withThemeContext(CastElementComponent);