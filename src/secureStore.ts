import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { SessionIdKey } from './constants/api';

const setSessionId = async (sessionId: string | null): Promise<void> => {
    if (!sessionId) {
        deleteItemAsync(SessionIdKey)
    } else {
        await setItemAsync(SessionIdKey, sessionId);
    }
};

const getSessionId = async (): Promise<string | null> => await getItemAsync(SessionIdKey);

export { setSessionId, getSessionId };
