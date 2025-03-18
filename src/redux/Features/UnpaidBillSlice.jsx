import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bill: [],
  status: "idle",
  error: null,
};

const unpaidBillSlice = createSlice({
  name: "unPaidBill",
  initialState,
  reducers: {
    setUnPaidBill(state, action) {
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

export const { setUnPaidBill, setLoading, setError } = unpaidBillSlice.actions;
export default unpaidBillSlice.reducer;
