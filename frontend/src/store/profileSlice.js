import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileApi from '../api/profileApi';

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.getMyProfile();
    } catch (error) {
       // Ignore 404s for new users
      if (error.response?.status === 404) {
          return null;
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await profileApi.createOrUpdateProfile(profileData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save profile');
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    updateResumeUrl: (state, action) => {
        if (state.data) {
            state.data.resumeUrl = action.payload;
        } else {
            state.data = { resumeUrl: action.payload };
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, updateResumeUrl } = profileSlice.actions;
export default profileSlice.reducer;
