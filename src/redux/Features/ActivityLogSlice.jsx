import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activityLog: [],
  allActivityLogs: [],
  allActivityLogsForBills: [],
  status: "idle",
  error: null,
};

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {
    setActivityLogs(state, action) {
      state.activityLog = action.payload;
    },
    setAllActivityLogs(state, action) {
      state.allActivityLogs = action.payload;
    },
    setAllActivityLogsForBills(state, action) {
      state.allActivityLogsForBills = action.payload;
    },
    deleteLogs(state, action) {
      state.activityLog = state.activityLog.filter(
        (log) => log.id !== action.payload
      );
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

export const {
  setActivityLogs,
  setAllActivityLogs,
  setAllActivityLogsForBills,
  deleteLogs,
  setError,
  setLoading,
} = activityLogSlice.actions;
export default activityLogSlice.reducer;
