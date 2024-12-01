import { FunctionComponent, useCallback, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import debounce from 'lodash.debounce';

interface Props {
    onChange: (value: string) => void
}

const SearchBarComponent: FunctionComponent<Props> = (props: Props) => {
    const { onChange } = props;

    const [clicked, setClicked] = useState(false);
    const [value, setValue] = useState<string>('');

    const requestChange = useCallback(debounce((newValue: string) => onChange(newValue), 500), []);

    const debouceRequest = (newValue: string) => {
        setValue(newValue);
        requestChange(newValue);
    };

    return (
        <View style={styles.container}>
            <View style={ clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
                <Feather
                    name="search"
                    size={20}
                    color="black"
                    style={{ marginLeft: 1 }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={value}
                    onChangeText={debouceRequest}
                    onFocus={() => setClicked(true)}
                />
                {clicked && (
                    <Entypo
                        name="cross"
                        size={20}
                        color="black"
                        style={styles.cross}
                        onPress={() => debouceRequest("")}
                    />
                )}
            </View>
            {clicked && (
                <View>
                    <Button
                        title="Cancel"
                        onPress={() => {
                            Keyboard.dismiss();
                            setClicked(false);
                        }}
                    />
                </View>
            )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
    },
    cross: {
        position: 'absolute',
        padding: 1,
        right: 10,
    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "90%",
    },
});

export const SearchBar = SearchBarComponent;