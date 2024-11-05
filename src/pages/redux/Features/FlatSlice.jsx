// src/redux/Features/flatSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createFlatMaster,
  getFlatMasterById,
  updateFlatMaster
} from './FlatApi/FlatApi';

const flatSlice = createSlice({
  name: 'flat',
  initialState: {
    flats: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload === 'loading';
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    // setFlats: (state, action) => {
    //   state.flats = action.payload;
    // },
    setFlats: (state, action) => {
      state.flats = action.payload;
    },
    addFlat: (state, action) => {
      state.flats.push(action.payload);
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
