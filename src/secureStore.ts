import { deleteItemAsync, getItem, setItemAsync } from 'expo-secure-store';
import { SessionIdKey } from './constants/api';

const setSessionId = async (sessionId: string | null): Promise<void> => {
    if (!sessionId) {
        deleteItemAsync(SessionIdKey)
    } else {
        await setItemAsync(SessionIdKey, sessionId);
    }
};

const getSessionId = (): string | null => getItem(SessionIdKey);

export { setSessionId, getSessionId };
