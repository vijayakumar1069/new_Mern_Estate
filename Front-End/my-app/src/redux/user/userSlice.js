import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFaliure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteStart: (state) => {
      state.loading = true;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutStart: (state) => {
      state.loading = true;
    },
    signoutsuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    signoutfailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  signInFaliure,
  signInStart,
  signInSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutStart,signoutfailure,signoutsuccess
} = userSlice.actions;
export default userSlice.reducer;
