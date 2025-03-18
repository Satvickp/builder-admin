import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bill: [],
  status: "idle",
  error: null,
};

const paidBillSlice = createSlice({
  name: "paidBill",
  initialState,
  reducers: {
    setPaidBill(state, action) {
      state.bill = action.payload;
      state.status = "succeeded";
    },
    setLoading(state) {
      state.status = "loading";
    },
    setError(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setPaidBill, setLoading, setError } = paidBillSlice.actions;
export default paidBillSlice.reducer;
