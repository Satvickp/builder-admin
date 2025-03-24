// src/features/siteMasterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

const siteMasterSlice = createSlice({
  name: "siteMaster",
  initialState,
  reducers: {
    setSiteMasters(state, action) {
      state.data = action.payload;
      state.status = "succeeded";
    },
    setLoading(state) {
      state.status = "loading";
    },
    setError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    addSiteMaster(state, action) {
      state.data.push(action.payload);
      state.status = "succeeded";
    },
    updateSiteMaster(state, action) {
      const updatedSite = action.payload;
      const index = state.data.findIndex((site) => site.id === updatedSite.id);
      if (index !== -1) {
        state.data[index] = updatedSite;
        state.status = "succeeded";
      }
    },
    deleteSiteMaster(state, action) {
      const siteId = action.payload;
      state.data = state.data.filter((site) => site.id !== siteId);
      state.status = "succeeded";
    },
  },
});

export const {
  setSiteMasters,
  setLoading,
  setError,
  addSiteMaster,
  updateSiteMaster,
  deleteSiteMaster,
} = siteMasterSlice.actions;

export default siteMasterSlice.reducer;
