import React, { useEffect, useState } from "react";
import { Table, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  setStateMasters,
  addStateMaster,
  updateStateMaster,
  setLoading,
  setError,
  selectStateMasters,
} from "../redux/Features/stateMasterSlice";
import { getStates, createState, updateState } from "../Api/stateapi/stateMasterApi";
import { deleteState } from "../Api/stateapi/stateMasterApi";  // Import the deleteState function

function States() {
  const dispatch = useDispatch();
  const stateMasters = useSelector(selectStateMasters);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [error, setErrorState] = useState("");
  const cred = useSelector(state => state.Cred);

  const [newState, setNewState] = useState({
    name: "",
    code: "",
    monthlyChargesType: "",
    monthlyCharges: "",
    origin: "",
  });

  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setErrorState("");
    setNewState({
      name: "",
      code: "",
      monthlyChargesType: "",
      monthlyCharges: "",
      origin: "",
    });
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewState({ ...newState, [name]: name === "origin" ? String(value) : value });
  };

  const validateStateData = (stateData) => {
    if (
      !stateData.name ||
      !stateData.code ||
      !stateData.monthlyChargesType ||
      !stateData.monthlyCharges ||
      !stateData.origin
    ) {
      return "All fields are required.";
    }
    if (stateData.monthlyCharges <= 0) {
      return "Monthly Charges must be a positive number.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState("");

    const validationError = validateStateData(newState);
    if (validationError) {
      setErrorState(validationError);
      return;
    }

    const isDuplicate = stateMasters.some((state) => state.code === newState.code);
    if (isDuplicate && !isEdit) {
      setErrorState(`State with code "${newState.code}" already exists.`);
      return;
    }

    dispatch(setLoading("loading"));
    try {
      if (isEdit && currentState && currentState.code) {
        const updatedState = await updateState(currentState.code, newState);
        console.log("Updated state:", updatedState); // Debug API response
        dispatch(updateStateMaster(updatedState));
      } else {
        const createdState = await createState({ ...newState, builderId: cred.id });
        console.log("Created state:", createdState); // Debug API response
        dispatch(addStateMaster(createdState));
      }

      await fetchStateMasters(); // Refresh state data
      handleClose();
      dispatch(setLoading("succeeded"));
    } catch (error) {
      const backendError = error.response?.data?.message || error.message || "Failed to add/update state master.";
      console.error("Error in handleSubmit:", backendError);
      setErrorState(backendError);
      dispatch(setLoading("failed"));
    }
  };

  const handleEdit = (stateMaster) => {
    setCurrentState(stateMaster);
    setNewState({
      name: stateMaster.name || "",
      code: stateMaster.code || "",
      monthlyChargesType: stateMaster.monthlyChargesType || "",
      monthlyCharges: stateMaster.monthlyCharges || "",
      origin: String(stateMaster.origin) || "",
    });
    setIsEdit(true);
    handleShow();
  };

  // Function to handle state deletion
  const handleDelete = async (stateCode) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      try {
        await deleteState(stateCode); // Call deleteState API
        await fetchStateMasters(); // Refresh state data
      } catch (error) {
        console.error("Error deleting state:", error.message || error);
        setErrorState("Failed to delete state.");
      }
    }
  };

  const fetchStateMasters = async () => {
    dispatch(setLoading("loading"));
    try {
      const states = await getStates(cred.id);
      dispatch(setStateMasters(states));
      dispatch(setLoading("succeeded"));
    } catch (error) {
      console.error("Error fetching state masters:", error.message || error);
      dispatch(setError("Failed to fetch state masters"));
      dispatch(setLoading("failed"));
    }
  };

  useEffect(() => {
    fetchStateMasters();
  }, [dispatch]);

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <h1 className="text-white ml-4 text-4xl">States</h1>
        </div>
        <div className="w-36 flex justify-end">
          <Button variant="primary" className="w-80" onClick={handleShow}>
            Add New
          </Button>
        </div>
      </div>

      <Table striped bordered hover className="w-full">
        <thead>
          <tr>
            <th>State</th>
            <th>Code</th>
            <th>Monthly Charges Type</th>
            <th>Monthly Charges</th>
            <th>Origin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stateMasters.map((stateMaster) => (
            <tr key={stateMaster.id}>
              <td>{stateMaster.name}</td>
              <td>{stateMaster.code}</td>
              <td>{stateMaster.monthlyChargesType}</td>
              <td>{stateMaster.monthlyCharges}</td>
              <td>{String(stateMaster.origin) || "N/A"}</td>
              <td>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Edit</Tooltip>}
                >
                  <Button
                    variant="link"
                    className="p-0 text-primary"
                    onClick={() => handleEdit(stateMaster)}
                  >
                    <FaEdit size={20} />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Delete</Tooltip>}
                >
                  <Button
                    variant="link"
                    className="p-0 text-danger"
                    onClick={() => handleDelete(stateMaster.id)} // Call handleDelete on click
                  >
                    <FaTrash size={20} />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} className="mt-40">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit State Master" : "Add State Master"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">State Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={newState.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input
                type="number"
                className="form-control"
                name="code"
                value={newState.code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Monthly Charges Type</label>
              <select
                className="form-select"
                name="monthlyChargesType"
                value={newState.monthlyChargesType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Fixed">Fixed</option>
                <option value="PerSqft">PerSqft</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Monthly Charges</label>
              <input
                type="number"
                className="form-control"
                step="0.01"
                name="monthlyCharges"
                value={newState.monthlyCharges}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Origin</label>
              <select
                className="form-select"
                name="origin"
                value={newState.origin}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
            <Button variant="primary" type="submit">
              {isEdit ? "Update" : "Done"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default States;
























// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useDispatch, useSelector } from "react-redux";
// import { FaEdit } from "react-icons/fa";
// import {
//   setStateMasters,
//   addStateMaster,
//   updateStateMaster,
//   setLoading,
//   setError,
//   selectStateMasters,
// } from "../redux/Features/stateMasterSlice";
// import { getStates, getStatesByBuilderId, createState, updateState } from "../Api/stateapi/stateMasterApi";

// function States() {
//   const dispatch = useDispatch();
//   const stateMasters = useSelector(selectStateMasters);
//   const [builderId, setBuilderId] = useState(""); // New state for builderId input
//   const [show, setShow] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [currentState, setCurrentState] = useState(null);
//   const [error, setErrorState] = useState("");

//   const [newState, setNewState] = useState({
//     name: "",
//     code: "",
//     monthlyChargesType: "",
//     monthlyCharges: "",
//     origin: "",
//   });

//   const handleClose = () => {
//     setShow(false);
//     setIsEdit(false);
//     setErrorState("");
//     setNewState({
//       name: "",
//       code: "",
//       monthlyChargesType: "",
//       monthlyCharges: "",
//       origin: "",
//     });
//   };

//   const handleShow = () => setShow(true);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewState({ ...newState, [name]: name === "origin" ? String(value) : value });
//   };

//   const handleBuilderIdChange = (e) => {
//     setBuilderId(e.target.value); // Update builderId state
//   };

//   const validateStateData = (stateData) => {
//     if (
//       !stateData.name ||
//       !stateData.code ||
//       !stateData.monthlyChargesType ||
//       !stateData.monthlyCharges ||
//       !stateData.origin
//     ) {
//       return "All fields are required.";
//     }
//     if (stateData.monthlyCharges <= 0) {
//       return "Monthly Charges must be a positive number.";
//     }
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorState("");

//     const validationError = validateStateData(newState);
//     if (validationError) {
//       setErrorState(validationError);
//       return;
//     }

//     const isDuplicate = stateMasters.some((state) => state.code === newState.code);
//     if (isDuplicate && !isEdit) {
//       setErrorState(`State with code "${newState.code}" already exists.`);
//       return;
//     }

//     dispatch(setLoading("loading"));
//     try {
//       if (isEdit && currentState && currentState.code) {
//         const updatedState = await updateState(currentState.code, newState);
//         console.log("Updated state:", updatedState); // Debug API response
//         dispatch(updateStateMaster(updatedState));
//       } else {
//         const createdState = await createState(newState);
//         console.log("Created state:", createdState); // Debug API response
//         dispatch(addStateMaster(createdState));
//       }

//       await fetchStateMasters(); // Refresh state data
//       handleClose();
//       dispatch(setLoading("succeeded"));
//     } catch (error) {
//       const backendError = error.response?.data?.message || error.message || "Failed to add/update state master.";
//       console.error("Error in handleSubmit:", backendError);
//       setErrorState(backendError);
//       dispatch(setLoading("failed"));
//     }
//   };

//   const handleEdit = (stateMaster) => {
//     setCurrentState(stateMaster);
//     setNewState({
//       name: stateMaster.name || "",
//       code: stateMaster.code || "",
//       monthlyChargesType: stateMaster.monthlyChargesType || "",
//       monthlyCharges: stateMaster.monthlyCharges || "",
//       origin: String(stateMaster.origin) || "",
//     });
//     setIsEdit(true);
//     handleShow();
//   };

//   const fetchStateMasters = async () => {
//     dispatch(setLoading("loading"));
//     try {
//       const states = builderId
//         ? await getStatesByBuilderId(builderId) // Fetch states by builderId if provided
//         : await getStates(); // Fetch all states if no builderId is provided
//       dispatch(setStateMasters(states));
//       dispatch(setLoading("succeeded"));
//     } catch (error) {
//       console.error("Error fetching state masters:", error.message || error);
//       dispatch(setError("Failed to fetch state masters"));
//       dispatch(setLoading("failed"));
//     }
//   };

//   useEffect(() => {
//     fetchStateMasters();
//   }, [dispatch, builderId]); // Re-fetch states when builderId changes

//   return (
//     <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <div className="w-1/3">
//           <h1 className="text-white ml-4 text-4xl">States</h1>
//         </div>
//         <div className="w-36 flex justify-end">
//           <Button variant="primary" className="w-80" onClick={handleShow}>
//             Add New
//           </Button>
//         </div>
//       </div>

//       <div className="mb-4">
//         <label className="text-white mr-2">Builder ID:</label>
//         <input
//           type="text"
//           value={builderId}
//           onChange={handleBuilderIdChange}
//           className="form-control w-1/4"
//           placeholder="Enter Builder ID"
//         />
//         <Button
//           variant="secondary"
//           className="mt-2"
//           onClick={() => fetchStateMasters()}
//         >
//           Fetch States
//         </Button>
//       </div>

//       <Table striped bordered hover className="w-full">
//         <thead>
//           <tr>
//             <th>State</th>
//             <th>Code</th>
//             <th>Monthly Charges Type</th>
//             <th>Monthly Charges</th>
//             <th>Origin</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stateMasters.map((stateMaster) => (
//             <tr key={stateMaster.code}>
//               <td>{stateMaster.name}</td>
//               <td>{stateMaster.code}</td>
//               <td>{stateMaster.monthlyChargesType}</td>
//               <td>{stateMaster.monthlyCharges}</td>
//               <td>{String(stateMaster.origin) || "N/A"}</td>
//               <td>
//                 <OverlayTrigger
//                   placement="top"
//                   overlay={<Tooltip>Edit</Tooltip>}
//                 >
//                   <Button
//                     variant="link"
//                     className="p-0 text-primary"
//                     onClick={() => handleEdit(stateMaster)}
//                   >
//                     <FaEdit size={20} />
//                   </Button>
//                 </OverlayTrigger>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Modal show={show} onHide={handleClose} className="mt-40">
//         <Modal.Header closeButton>
//           <Modal.Title>{isEdit ? "Edit State Master" : "Add State Master"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <div className="alert alert-danger">{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label">State Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 value={newState.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Code</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="code"
//                 value={newState.code}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Monthly Charges Type</label>
//               <select
//                 className="form-select"
//                 name="monthlyChargesType"
//                 value={newState.monthlyChargesType}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Fixed">Fixed</option>
//                 <option value="PerSqft">PerSqft</option>
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Monthly Charges</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 step="0.01"
//                 name="monthlyCharges"
//                 value={newState.monthlyCharges}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Origin</label>
//               <select
//                 className="form-select"
//                 name="origin"
//                 value={newState.origin}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="yes">yes</option>
//                 <option value="no">no</option>
//               </select>
//             </div>
//             <Button variant="primary" type="submit">
//               {isEdit ? "Update" : "Done"}
//             </Button>
//           </form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default States;
