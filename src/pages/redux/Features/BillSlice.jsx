// src/redux/Features/BillSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [], // Ensure this is initialized as an empty array
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action) => {
      state.bills = action.payload;
    },
    addBill: (state, action) => {
      state.bills.push(action.payload);
    },
    removeBill: (state, action) => {
      state.bills = state.bills.filter(bill => bill.id !== action.payload);
    },
    updateBill: (state, action) => {
      const index = state.bills.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
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

export const { addBill, setError, setLoading, removeBill, setBills, updateBill } = billSlice.actions;
export default billSlice.reducer;
