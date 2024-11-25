// redux/Features/stateMasterSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const stateMasterSlice = createSlice({
  name: 'stateMaster',
  initialState: {
    stateMasters: [],
    loading: 'idle',
    error: null,
  },
  reducers: {
    setStateMasters: (state, action) => {
      state.stateMasters = action.payload;
    },
    addStateMaster: (state, action) => {
      state.stateMasters = [action.payload, ...state.stateMasters];
    },
    updateStateMaster: (state, action) => {
      const index = state.stateMasters.findIndex(item => item.code === action.payload.code);
      if (index >= 0) {
        state.stateMasters[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});
export const selectStateMasters = (state) => state.stateMaster.stateMasters;
export const { setStateMasters, addStateMaster, updateStateMaster, setLoading, setError } = stateMasterSlice.actions;

export default stateMasterSlice.reducer;
