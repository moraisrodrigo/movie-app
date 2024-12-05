import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { movieReducer } from "./slicers/movieSlice";
import { authenticationReducer } from "./slicers/authenticationSlice";
import { preferencesReducer } from "./slicers/preferencesSlice";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const rootReducer = combineReducers({
    movie: movieReducer,
    authentication: authenticationReducer,
    preferences: preferencesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PERSIST, REGISTER, PURGE, PAUSE],
        },
    }),
    devTools: true,
});

type StoreType = typeof store;
type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>

const persistor = persistStore(store);

export { store, persistor };

export type { AppDispatch, RootState, StoreType };