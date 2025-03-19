// src/pages/redux/Features/ServiceSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "serviceMasters",
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {
    setServiceMasters(state, action) {
      state.services = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setServiceMasters, setLoading, setError } = serviceSlice.actions;
export default serviceSlice.reducer;
