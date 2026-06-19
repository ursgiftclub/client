import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  currentUser: null,
  isAuthenticated: false,
  authChecked: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // login
    login: (state, action) => {
      state.loading = false;

      state.error = null;

      state.currentUser = action.payload;

      state.isAuthenticated = true;

      state.authChecked = true;
    },

    // register
    register: (state, action) => {
      state.loading = false;

      state.error = null;

      state.currentUser = action.payload;

      state.isAuthenticated = true;

      state.authChecked = true;
    },

    // restore user after refresh
    setUser: (state, action) => {
      state.currentUser = action.payload;

      state.isAuthenticated = true;

      state.loading = false;

      state.error = null;
    },

    // logout
    logout: (state) => {
      state.currentUser = null;

      state.isAuthenticated = false;

      state.loading = false;

      state.error = null;

      state.authChecked = true;
    },

    // auth check completed
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },

    // set error
    setError: (state, action) => {
      state.loading = false;

      state.error = action.payload;
    },

    // clear error
    clearError: (state) => {
      state.error = null;
    },

    // clear user
    clearUser: (state) => {
      state.currentUser = null;

      state.isAuthenticated = false;
    },
  },
});

export const {
  login,
  register,
  logout,
  setUser,
  setLoading,
  setError,
  clearError,
  clearUser,
  setAuthChecked,
} = authSlice.actions;

export default authSlice.reducer;
