import { useEffect } from "react";
import "./Style.css";
import {
  // activityLogs,
  // deleteActivityLogs,
  getAllLogs,
  // getAllLogsForBills,
} from "../Api/ActivityLogApi/ActivityLogApi";
import { useSelector, useDispatch } from "react-redux";
import {
  setActivityLogs,
  // setAllActivityLogs,
  // setAllActivityLogsForBills,
  // deleteLogs,
} from "../redux/Features/ActivityLogSlice";

function ActivityStatus() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.login);
  const cred = useSelector((state) => state.Cred);
  const activityLog = useSelector((state) => state.activityLog.activityLog);
  // const allActivityLogs = useSelector(
  //   (state) => state.activityLog.allActivityLogs
  // );
  let date = new Date();
  let fromDate = new Date(date.getFullYear(), date.getMonth());
  let endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  // const getActivityLog = async () => {
  //   const resp = await activityLogs(token.storagetoken, 3);
  //   // console.log(resp);
  //   dispatch(setActivityLogs(resp));
  // };
  // useEffect(() => {
  //   getActivityLog();
  // }, []);
  // console.log(activityLog);

  const getAllLogsofActivityLog = async () => {
    const resp = await getAllLogs(
      token.storagetoken,
      1,
      10,
      "desc",
      "createdTime",
      cred.id,
      fromDate.toISOString(),
      endDate.toISOString()
    );
    dispatch(setActivityLogs(resp.content));
  };
  useEffect(() => {
    getAllLogsofActivityLog();
  }, []);

  // const getAllLogsForBillsOfActivityLog = async () => {
  //   const resp = await getAllLogsForBills(
  //     token.storagetoken,
  //     1,
  //     10,
  //     "desc",
  //     "createdTime",
  //     cred.id,
  //     fromDate.toISOString(),
  //     endDate.toISOString()
  //   );
  //   console.log(resp);
  // };
  // useEffect(() => {
  //   getAllLogsForBillsOfActivityLog();
  // });

  // const deletelogs = async () => {
  //   const resp = await deleteActivityLogs(token.storagetoken, 2);
  //   console.log(resp);
  // };
  // useEffect(() => {
  //   deletelogs();
  // });

  return (
    <div className="activity-status-container">
      <h3 className="table-title">Activity Status</h3>
      <div className="bg-slate-600 max-w-2xl pl-4 text-white rounded-md py-4 overflow-y-scroll overflow-x-auto h-[600px] scroll-smooth">
        <div className="text-lg grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-2 py-2 font-bold border-b border-white">
          <span>Resource ID</span>
          <span>Log Type</span>
          <span>Log Date</span>
          <span>Log Time</span>
        </div>
        <ul>
          {activityLog.map((activity, index) => (
            <li key={index}>
              <div className="text-lg grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-2 py-2 ">
                <span>{activity.resourceId}</span>
                <span>{activity.logType}</span>
                <span>{activity.logDate}</span>
                <span>{activity.logTime}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ActivityStatus;
