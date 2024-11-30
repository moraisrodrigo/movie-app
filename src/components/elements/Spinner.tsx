import { FunctionComponent } from 'react';
import { Platform, ActivityIndicator, View, ViewStyle, StyleProp, ColorValue } from 'react-native';

interface Props {
    style?: StyleProp<ViewStyle>;
    color?: ColorValue;
    size?: number 
}

export const Spinner: FunctionComponent<Props> = ({ 
    style = {},
    size = 50,
    color = '#000000'
}: Props) => (
    <View style={style}>
    {Platform.OS === 'ios' ? (
        <ActivityIndicator
            size="small"
            color={color}
        />
    ) : (
        <ActivityIndicator
            size={size}
            color={color}
        />
    )}
  </View>
);
