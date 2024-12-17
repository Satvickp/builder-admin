import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  token: null,
  error: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      console.log("Login Success Payload:", action.payload);
      state.loading = false;
      state.token = action.payload;
      // console.log("Redux State Token:", state.token);
      state.isAuthenticated = true;
      window.sessionStorage.setItem("token", action.payload);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure } = userSlice.actions;

export default userSlice.reducer;
