// src/features/siteMasterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

const siteMasterSlice = createSlice({
  name: 'siteMaster',
  initialState,
  reducers: {
    setSiteMasters(state, action) {
      state.data = action.payload;
      state.status = 'succeeded';
    },
    setLoading(state) {
      state.status = 'loading';
    },
    setError(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  setSiteMasters,
  setLoading,
  setError,
} = siteMasterSlice.actions;

export default siteMasterSlice.reducer;
