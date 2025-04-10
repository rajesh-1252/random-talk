import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  name: string;
  avatar: string;
  online: boolean;
};

export type MatchingState = {
  searchingStatus: "idle" | "searching" | "matched" | "timeout" | "error";
  matchedUser: User | null;
  error: string | null;
};

const initialState: MatchingState = {
  searchingStatus: "idle",
  matchedUser: null,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

let matchController: AbortController | null = null

export const findMatch = createAsyncThunk<User, void>(
  "matching/findMatch",
  async (_, { rejectWithValue }) => {
    try {
      if (matchController) {
        matchController.abort()
      }
      matchController = new AbortController()
      const response = await axiosInstance.get<User>(`${API_URL}/matching/find-match`, { signal: matchController.signal } as any);
      console.log(response.data,)
      return response.data.result;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || "Failed to find a match");
    }
  }
);

export const cancelMatch = createAsyncThunk<User, void>(
  "matching/cancelMatch",
  async (_, { rejectWithValue }) => {
    try {
      if (matchController) {
        matchController.abort();
        matchController = null;
      }
      const response = await axiosInstance.get<User>(`${API_URL}/matching/cancel-match`);
      console.log('runnning')
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data?.message || "Failed to cancel match");
    }
  }
);


export const matchingSlice = createSlice({
  name: "matching",
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.searchingStatus = "idle";
      state.matchedUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findMatch.pending, (state) => {
        state.searchingStatus = "searching";
        state.error = null;
      })
      .addCase(findMatch.fulfilled, (state, action: PayloadAction<User>) => {
        state.searchingStatus = "matched";
        state.matchedUser = action.payload;
      })
      .addCase(findMatch.rejected, (state, action) => {
        state.searchingStatus = "error";
        state.error = action.payload as string;
      })
      .addCase(cancelMatch.fulfilled, (state) => {
        state.searchingStatus = "idle";
        state.matchedUser = null;
      })


  },
});

export const { resetSearch } = matchingSlice.actions;
export default matchingSlice.reducer;
