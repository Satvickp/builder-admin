import React, { useEffect } from "react";
import "./Style.css"; // Include your custom CSS
import Table from "react-bootstrap/Table";
import {
  activityLogs,
  deleteActivityLogs,
  getAllLogs,
  getAllLogsForBills,
} from "../Api/ActivityLogApi/ActivityLogApi";
import { useSelector, useDispatch } from "react-redux";
import {
  setActivityLogs,
  setAllActivityLogs,
  setAllActivityLogsForBills,
  deleteLogs,
} from "../redux/Features/ActivityLogSlice";

function ActivityStatus() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.login);
  const cred = useSelector((state) => state.Cred);
  const activityLog = useSelector((state) => state.activityLog.activityLog);
  const allActivityLogs = useSelector(
    (state) => state.activityLog.allActivityLogs
  );
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
    console.log(resp);
  };
  useEffect(() => {
    getAllLogsofActivityLog();
  });

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

  const data = [
    {
      customerName: "John Doe",
      activityStatus: "Completed",
      date: "01/12/24",
      time: "10:30 AM",
    },
    {
      customerName: "Jane Smith",
      activityStatus: "Pending",
      date: "02/12/24",
      time: "02:00 PM",
    },
    {
      customerName: "Emily Johnson",
      activityStatus: "In Progress",
      date: "03/12/24",
      time: "11:15 AM",
    },
  ];
  return (
    <div className="activity-status-container">
      <h3 className="table-title">Activity Status</h3>
      <div className="bg-slate-600 max-w-2xl pl-4 text-white rounded-md py-4 overflow-y-scroll overflow-x-auto h-[600px] scroll-smooth">
        <ul>
          {data.map((activity, index) => (
            <li key={index}>
              <div className="text-lg grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-2 py-2 ">
                <span>{activity.customerName}</span>
                <span>{activity.activityStatus}</span>
                <span>{activity.date}</span>
                <span>{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* <Table striped bordered hover className="activity-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date</th>
            <th>Time</th>
            <th>Customer Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Update taskbar</td>
            <td>12/12/2024</td>
            <td>4:30pm</td>
            <td>Ramesh Kumar</td>
          </tr>
          <tr>
          <td>Update taskbar</td>
            <td>12/12/2024</td>
            <td>4:30pm</td>
            <td>Ramesh Kumar</td>
          </tr>
          <tr>
          <td>Update taskbar</td>
            <td>12/12/2024</td>
            <td>4:30pm</td>
            <td>Ramesh Kumar</td>
          </tr>
          <tr>
          <td>Update taskbar</td>
            <td>12/12/2024</td>
            <td>4:30pm</td>
            <td>Ramesh Kumar</td>
          </tr>
          <tr>
          <td>Update taskbar</td>
            <td>12/12/2024</td>
            <td>4:30pm</td>
            <td>Ramesh Kumar</td>
          </tr>
         
        </tbody>
      </Table> */}
    </div>
  );
}

export default ActivityStatus;
