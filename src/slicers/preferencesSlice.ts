import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SlicerName } from "../constants/slicers";
import { AppTheme } from "../types/theme";


interface PreferencesSliceState {
    theme: AppTheme;
}

const preferencesSliceState: PreferencesSliceState = {
    theme: AppTheme.Dark
}

const preferencesSlice = createSlice({
    name: SlicerName.Preferences,
    initialState: preferencesSliceState,
    reducers: {
    setTheme: (state, { payload }: PayloadAction<AppTheme>) => {
            state.theme = payload;
        }
    }
});

const { reducer: preferencesReducer, actions: { setTheme } } = preferencesSlice;

export type { PreferencesSliceState };

export { preferencesReducer, setTheme };
