import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../types/movie";
import { SlicerName } from "../constants/slicers";


interface MovieState {
    selectedMovie: Movie | null;
}

const movieSliceState: MovieState = {
    selectedMovie: null
}

const movieSlice = createSlice({
    name: SlicerName.Movie,
    initialState: movieSliceState,
    reducers: {
        setSelectedMovie: (state, { payload }: PayloadAction<Movie | null>) => {
            state.selectedMovie = payload;
        }
    }
});

const { reducer: movieReducer, actions: { setSelectedMovie } } = movieSlice;

export type { MovieState };

export { movieReducer, setSelectedMovie };
