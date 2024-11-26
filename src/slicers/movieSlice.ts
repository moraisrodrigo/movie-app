import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../types/movie";
import { SlicerName } from "../constants/slicers";


interface MovieState {
    firstMovie: Movie | null;
    selectedMovie: Movie | null;
}

const movieSliceState: MovieState = {
    firstMovie: null,
    selectedMovie: null
}

const movieSlice = createSlice({
    name: SlicerName.Movie,
    initialState: movieSliceState,
    reducers: {
        setSelectedMovie: (state, { payload }: PayloadAction<Movie | null>) => {
            state.selectedMovie = payload;
        },
        setFirstMovie: (state, { payload }: PayloadAction<Movie | null>) => {
            state.firstMovie = payload;
        }
    }
});

const { reducer: movieReducer, actions: { setSelectedMovie, setFirstMovie } } = movieSlice;

export type { MovieState };

export { movieReducer, setSelectedMovie, setFirstMovie };
