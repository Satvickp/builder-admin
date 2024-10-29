import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  token: null,
  error: null,
};

 export const userSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
        console.log("Login Success Payload:", action.payload);
      state.loading = false;
      state.token = action.payload.token;
      window.sessionStorage.setItem('token', action.payload.token);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const { loginRequest, loginSuccess, loginFailure } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
