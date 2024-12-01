import { FunctionComponent, ReactElement, useState } from "react";
import {  StyleSheet } from "react-native";
import { MovieVideo } from "../../types/responses";
import { WebView } from "react-native-webview";
import { Spinner } from "./Spinner";

interface Props {
    video: MovieVideo
}

export const VideoPlayer: FunctionComponent<Props> = (props: Props) => {
    const { video: { key } } = props;

    const [webkey , setWebKey] = useState(0);
    const [ready, setReady] = useState(false);

    const onLoadEnd = (): void => {
        if(!ready) {
            setWebKey(Date.now());
            setReady(true)
        }
    }

    const onLoad = (): ReactElement => <Spinner style={styles.container} />;

    return (
        <WebView
            key={webkey}
            source={{ uri: `https://www.youtube.com/embed/${key}?autoplay=0&hl=pt&modestbranding=1&fs=1&autohide=1` }}
            startInLoadingState
            allowsPictureInPictureMediaPlayback
            allowsLinkPreview
            allowsAirPlayForMediaPlayback
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            javaScriptCanOpenWindowsAutomatically
            javaScriptEnabled
            onLoad={onLoad}
            renderLoading={onLoad}
            onLoadEnd={onLoadEnd}
            style={{ height: 275 }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%'
    }
});