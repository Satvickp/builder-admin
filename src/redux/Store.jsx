import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Features/loginSlice";
import registerReducer from "./Features/registerSlice";
import stateMasterReducer from "./Features/stateMasterSlice";
import siteMasterReducer from "./Features/siteMasterSlice";
import serviceMasterReducer from "./Features/ServiceSlice";
import flatReducer from "./Features/FlatSlice";
import billReducer from "./Features/BillSlice";
import UserSlice from "./Features/UserSlice";
import paidBillReducer from "./Features/PaidBillSlice";
import unPaidBillReducer from "./Features/UnpaidBillSlice";
import activityLogReducer from "./Features/ActivityLogSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    stateMaster: stateMasterReducer,
    siteMaster: siteMasterReducer,
    serviceMasters: serviceMasterReducer,
    paidBill: paidBillReducer,
    unPaidBill: unPaidBillReducer,
    flat: flatReducer,
    bills: billReducer,
    Cred: UserSlice,
    activityLog: activityLogReducer,
  },
});
