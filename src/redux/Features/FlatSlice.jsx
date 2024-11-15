// src/redux/Features/flatSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createFlatMaster,
  getFlatMasterById,
  updateFlatMaster
} from '../../Api/FlatApi/FlatApi';

const flatSlice = createSlice({
  name: 'flat',
  initialState: {
    flats: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFlats: (state, action) => {
      console.log("flat in slice :",action.payload.flats)
      state.flats = action.payload.flats;
    },
    addFlat: (state, action) => {
      state.flats = [action.payload, ...state.flats];
    },
    updateFlat: (state, action) => {
      const index = state.flats.findIndex(flat => flat.id === action.payload.id);
      if (index !== -1) {
        state.flats[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setFlats,
  addFlat,
  updateFlat
} = flatSlice.actions;

export const selectFlats = (state) => state.flat.flats;
export const selectLoading = (state) => state.flat.loading;
export const selectError = (state) => state.flat.error;

export default flatSlice.reducer;
