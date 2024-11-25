import { createSlice } from "@reduxjs/toolkit";

const billSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBills(state, action) {
      state.bills = action.payload;
    },
    addBill(state, action) {
       //state.bills =[action.payload];
       state.bills.push(action.payload);
    },
    updateBill(state, action) {
      const updatedBills = state.bills.map(bill =>
        bill.id === action.payload.id ? action.payload : bill
      );
      state.bills = updatedBills;
    },
    removeBill(state, action) {
      state.bills = state.bills.filter(bill => bill.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setPendingBills(state, action) {
      state.pendingBills = action.payload; // Store pending bills
    },
    setPaidBills(state, action) {
      state.paidBills = action.payload; // Store paid bills
    },
  },
});

export const { setPendingBills,setPaidBills,setBills, addBill, updateBill, removeBill, setLoading, setError } = billSlice.actions;

export default billSlice.reducer;
