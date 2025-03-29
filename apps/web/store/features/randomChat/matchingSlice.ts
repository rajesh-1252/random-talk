import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  name: string;
  avatar: string;
  online: boolean;
};

export type MatchingState = {
  searchingStatus: "idle" | "searching" | "matched" | "timeout";
  matchedUser: User | null;
  error: string | null;
};

const initialState: MatchingState = {
  searchingStatus: "idle",
  matchedUser: null,
  error: null,
};

export const matchingSlice = createSlice({
  name: "matching",
  initialState,
  reducers: {
    startSearch: (state) => {
      state.searchingStatus = "searching";
      state.error = null;
    },
    matchFound: (state, action: PayloadAction<User>) => {
      state.searchingStatus = "matched";
      state.matchedUser = action.payload;
    },
    searchTimeout: (state, action: PayloadAction<string | null>) => {
      state.searchingStatus = "timeout";
      state.error = action.payload;
    },
    cancelSearch: (state) => {
      state.searchingStatus = "idle";
      state.error = null;
    },
    resetSearch: (state) => {
      state.searchingStatus = "idle";
      state.matchedUser = null;
      state.error = null;
    },
  },
});

export const {
  startSearch,
  matchFound,
  searchTimeout,
  cancelSearch,
  resetSearch,
} = matchingSlice.actions;

export default matchingSlice.reducer;
