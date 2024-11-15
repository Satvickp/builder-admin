// src/services/stateService.js

import { getStates } from "../Features/stateapi/stateMasterApi"; // Import API call
import { setLoading, setStateMasters, setError } from "../Features/stateMasterSlice"; // Import actions

// Function to fetch state masters
export const fetchStateMasters = async (dispatch) => {
  dispatch(setLoading("loading"));
  try {
    const states = await getStates(); // Fetch states from API
    dispatch(setStateMasters(states)); // Dispatch state data to Redux store
    dispatch(setLoading("succeeded")); // Update loading status
  } catch (error) {
    console.error("Error fetching state masters:", error.message || error);
    dispatch(setError("Failed to fetch state masters")); // Dispatch error action
    dispatch(setLoading("failed")); // Update loading status
  }
};
