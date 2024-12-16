import React from 'react';
import './Style.css'; // Include your custom CSS
import Table from 'react-bootstrap/Table';

function ActivityStatus() {
  return (
    <div className="activity-status-container">
      <h3 className="table-title">Activity Status</h3>
      <div className="table-responsive"> {/* Make table scrollable on small screens */}
        <Table striped bordered hover className="activity-table">
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
        </Table>
      </div>
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

