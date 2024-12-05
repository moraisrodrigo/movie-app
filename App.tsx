import React, { FunctionComponent, useEffect, useState } from 'react';
import { AppRouter } from './src/AppRouter';
import { store, persistor } from './src/store';
import { setup } from './src/api';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { getSessionId } from './src/secureStore';

const App: FunctionComponent = () => {

    const [isPrepared, setIsPrepared] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessionId = async () => {
            const id = await getSessionId();
            setSessionId(id);
        };

        fetchSessionId();
    }, []);

    useEffect(() => {
        prepare();
    }, [sessionId]);

    const prepare = () => {
        setup(sessionId);
        setIsPrepared(true);
    }

    if (!isPrepared) return <></>;

    return (
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </PersistGate>
    );
}

export default App;
