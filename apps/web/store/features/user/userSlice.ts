import { SettingsAPI, UserAPI } from "@/service/userService";
import { ApiResponse } from "@/types/apiResponse";
import { ISettings, IUser, UserState } from "@/types/user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: UserState = {
  user: null,
  settings: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  return await UserAPI.getUser()
});

export const fetchUserSettings = createAsyncThunk("user/fetchSettings", async () => {
  return await SettingsAPI.getSettings()
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData: Partial<IUser>) => {
    const response = await axios.put("/api/user", userData);
    return response.data as IUser;
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settingsData: Partial<ISettings>) => {
    const response = await axios.put("/api/user/settings", settingsData);
    return response.data as ISettings;
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.settings = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<ApiResponse<IUser>>) => {
        state.user = action.payload.result;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user";
        state.loading = false;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action: PayloadAction<ISettings>) => {
        state.settings = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserSettings.fulfilled, (state, action: PayloadAction<ISettings>) => {
        state.settings = { ...state.settings, ...action.payload };
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
