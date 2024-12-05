import { FunctionComponent, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { ThemeContext, withThemeContext } from "../../controllers/ThemeController";
import { AppTheme } from "../../types/theme";

interface Props extends ThemeContext {
    onClick: () => void,
    label: string,
    startIcon?: ReactNode,
    endIcon?: ReactNode,
}

const ListItemComponent: FunctionComponent<Props> = (props: Props) => {
    const {
        theme,
        onClick,
        label,
        startIcon = <></>,
        endIcon = <></>,
    } = props;

	const styles = getStyles(theme === AppTheme.Dark);

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onClick}
            style={styles.container}
        >
            <View style={styles.secondContainer}>
                {startIcon}
                <Text style={styles.text}>{label}</Text>
            </View>
            {endIcon}
        </TouchableOpacity>        
    );
}

const getStyles = (isDarkTheme: boolean) => StyleSheet.create({
    container: {
        paddingBlock: 10,
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row", 
        width: "100%",
    },
    secondContainer: {
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row",
    },
    text: {
        marginStart: 10,
		color: isDarkTheme ? '#F7F7F7' : '#000000',
        fontSize: 22,
    }
});

export const ListItem = withThemeContext(ListItemComponent);