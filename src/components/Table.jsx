import React from "react";
import "./Style.css"; // Include your custom CSS
import Table from "react-bootstrap/Table";

function ActivityStatus() {
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
    {
      customerName: "Michael Brown",
      activityStatus: "Completed",
      date: "04/12/24",
      time: "04:45 PM",
    },
    {
      customerName: "Sarah Wilson",
      activityStatus: "Pending",
      date: "05/12/24",
      time: "09:00 AM",
    },
    {
      customerName: "David Taylor",
      activityStatus: "Completed",
      date: "06/12/24",
      time: "01:30 PM",
    },
    {
      customerName: "Emma Davis",
      activityStatus: "In Progress",
      date: "07/12/24",
      time: "03:45 PM",
    },
    {
      customerName: "Chris Martin",
      activityStatus: "Pending",
      date: "08/12/24",
      time: "10:00 AM",
    },
    {
      customerName: "Sophia Moore",
      activityStatus: "Completed",
      date: "09/12/24",
      time: "05:30 PM",
    },
    {
      customerName: "James Anderson",
      activityStatus: "In Progress",
      date: "10/12/24",
      time: "12:15 PM",
    },
    {
      customerName: "Olivia Thomas",
      activityStatus: "Completed",
      date: "11/12/24",
      time: "02:30 PM",
    },
    {
      customerName: "Liam Thompson",
      activityStatus: "Pending",
      date: "12/12/24",
      time: "11:00 AM",
    },
    {
      customerName: "Noah White",
      activityStatus: "In Progress",
      date: "13/12/24",
      time: "04:00 PM",
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
// const ActivityStatus = () => {
//   // Data for activity logs
//   const activityData = [
//     { status: 'green', activity: 'Update taskbar', date: '12/12/2024', time: '4:30 pm', customer: 'Ramesh Kumar' },
//     { status: 'green', activity: 'Update taskbar', date: '12/12/2024', time: '4:30 pm', customer: 'Ramesh Kumar' },
//     { status: 'red', activity: 'Update taskbar', date: '12/12/2024', time: '4:30 pm', customer: 'Ramesh Kumar' },
//     { status: 'yellow', activity: 'Update taskbar', date: '12/12/2024', time: '4:30 pm', customer: 'Ramesh Kumar' },
//   ];

//   return (
//     <div className='top'>
//     <div className="activity-status-container">
//       {/* <div className="activity-header"> */}
//         <h3>Activity Status</h3>
//         <span className="sync-btn">🔄 Sync</span>
//       {/* </div> */}
//       <table className="activity-table">
//         <thead>
//           <tr>
//             <th>Activity</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Customer Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {activityData.map((item, index) => (
//             <tr key={index}>
//               <td>
//                 <span className={`status-dot ${item.status}`}></span> {item.activity}
//               </td>
//               <td>{item.date}</td>
//               <td>{item.time}</td>
//               <td>{item.customer}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     </div>
//   );
// };

// export default ActivityStatus;
