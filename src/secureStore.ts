import { deleteItemAsync, getItem, setItem } from 'expo-secure-store';
import { SessionIdKey } from './constants/api';

const setSessionId = async (sessionId: string | null): Promise<void> => {
    if (!sessionId) {
        deleteItemAsync(SessionIdKey)
    } else {
        setItem(SessionIdKey, sessionId);
    }
};

const getSessionId = (): string | null => getItem(SessionIdKey);

export { setSessionId, getSessionId };
