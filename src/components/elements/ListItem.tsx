import { FunctionComponent, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

interface Props {
    onClick: () => void,
    label: string,
    startIcon?: ReactNode,
    endIcon?: ReactNode,
}

const ListItemComponent: FunctionComponent<Props> = (props: Props) => {
    const {
        onClick,
        label,
        startIcon = <></>,
        endIcon = <></>,
    } = props;

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

const styles = StyleSheet.create({
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
        color: "white",
        fontSize: 22,
    }
});

export const ListItem = ListItemComponent;