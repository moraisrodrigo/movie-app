import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SlicerName } from "../constants/slicers";
import { User } from "../types/user";


interface AuthenticationSliceState {
    authenticatedUser: User | null;
}

const authenticationSliceState: AuthenticationSliceState = {
    authenticatedUser: null
}

const authenticationSlice = createSlice({
    name: SlicerName.Authentication,
    initialState: authenticationSliceState,
    reducers: {
        setAuthenticatedUser: (state, { payload }: PayloadAction<User | null>) => {
            state.authenticatedUser = payload;
        }
    }
});

const { reducer: authenticationReducer, actions: { setAuthenticatedUser } } = authenticationSlice;

export type { AuthenticationSliceState };

export { authenticationReducer, setAuthenticatedUser };
