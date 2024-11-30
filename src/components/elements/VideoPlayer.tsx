import { FunctionComponent, useRef } from "react";
import {  StyleSheet } from "react-native";
import { MovieVideo } from "../../types/responses";
import { WebView } from "react-native-webview";
import { Spinner } from "./Spinner";

interface Props {
    video: MovieVideo
}

export const VideoPlayer: FunctionComponent<Props> = (props: Props) => {
    const { video } = props;

    const webViewRef = useRef(null);

    return (
        <WebView
            ref={webViewRef}
            source={{ uri: `https://www.youtube.com/embed/${video.key}?autoplay=0&hl=pt&modestbranding=1&fs=1&autohide=1` }}
            startInLoadingState
            allowsAirPlayForMediaPlayback
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            javaScriptCanOpenWindowsAutomatically
            javaScriptEnabled
            renderLoading={() => <Spinner style={styles.container} />}
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