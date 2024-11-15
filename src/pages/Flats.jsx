import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import {
  setFlats,
  setLoading,
  setError,
  addFlat,
  updateFlat,
  selectFlats,
  selectLoading,
  selectError
} from '../redux/Features/FlatSlice';
import { createFlatMaster, getFlatsBySiteAndState ,updateFlatMaster} from '../Api/FlatApi/FlatApi';
import { getStates } from '../Api/stateapi/stateMasterApi';
import { setStateMasters } from '../redux/Features/stateMasterSlice';
import { getAllSiteMastersByState } from '../Api/SiteApi/SiteApi';
import { setSiteMasters } from '../redux/Features/siteMasterSlice';

const FlatMaster = () => {
  const dispatch = useDispatch();
  const flats = useSelector(selectFlats);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const stateMasters = useSelector((state) => state.stateMaster.stateMasters) || [];
  const siteMasters = useSelector((state) => state.siteMaster.data) || [];

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flatId, setFlatId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);

  const [newFlat, setNewFlat] = useState({
    flatNo: '',
    ownerName: '',
    area: '',
    emailId: '',
    siteMasterId: 1,
    creditDays: 30,
    remark: '',
    openingBalance: 0,
  });

  // Fetch states when component mounts
  useEffect(() => {
    if (stateMasters.length === 0) {
      fetchStates();
    }
  }, [stateMasters]);

  const fetchStates = async () => {
    try {
      const states = await getStates();
      dispatch(setStateMasters(states));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  // Fetch sites when a state is selected
  useEffect(() => {
    if (selectedStateId) {
      fetchSites(selectedStateId);
    }
  }, [selectedStateId]);

  const fetchSites = async (stateId) => {
    dispatch(setLoading('loading'));
    try {
      const response = await getAllSiteMastersByState(stateId);
      dispatch(setSiteMasters(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading('succeeded'));
    }
  };



  // Fetch flats when both state and site are selected
  useEffect(() => {
    if (selectedSiteId && selectedStateId) {
      fetchFlats(selectedSiteId, selectedStateId);
    }
  }, [selectedSiteId, selectedStateId]);

  const fetchFlats = async (siteId, stateId) => {
    dispatch(setLoading('loading'));
    try {
      const response = await getFlatsBySiteAndState(siteId, stateId);
      console.log(response);
      dispatch(setFlats({
        flats: response.content, // array of flats
        totalElement: response.totalElement, // or another property if total count is available
        page: response.page // current page if pagination is used
      }));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading('succeeded'));
    }
  };


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFlat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    dispatch(setLoading('loading'));
    try {
      const createdFlat = await createFlatMaster(newFlat);
      dispatch(addFlat(createdFlat));
      setShowModal(false);
      resetNewFlat();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading('succeeded'));
    }
  };

  const resetNewFlat = () => {
    setNewFlat({
      flatNo: '',
      ownerName: '',
      area: '',
      emailId: '',
      siteMasterId: selectedSiteId || 1,
      creditDays: 30,
      remark: '',
      openingBalance: 0,
    });
  };

  const handleUpdate = async () => {
    dispatch(setLoading('loading'));
    try {
      const updatedFlat = await updateFlatMaster(flatId, newFlat);
      dispatch(updateFlat(updatedFlat));
      setShowModal(false);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading('succeeded'));
    }
  };

  const handleEdit = (flat) => {
    setNewFlat(flat);
    setFlatId(flat.id);
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Flats</h1>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setIsEdit(false);
              setShowModal(true);
            }}
          >
            Add New Flat
          </Button>

          {/* Dropdown for selecting state */}
          <Dropdown onSelect={(e) => setSelectedStateId(e)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedStateId ? stateMasters.find((state) => state.id === parseInt(selectedStateId))?.name : 'Select State'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {stateMasters.map((state) => (
                <Dropdown.Item key={state.id} eventKey={state.id}>
                  {state.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Dropdown for selecting site */}
          <Dropdown onSelect={(e) => setSelectedSiteId(e)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedSiteId ? siteMasters.find((site) => site.id === parseInt(selectedSiteId))?.name : 'Select Site'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {siteMasters.map((site) => (
                <Dropdown.Item key={site.id} eventKey={site.id}>
                  {site.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Flat Data Table */}
      <Table striped bordered hover className="w-full">
        <thead>
          <tr>
            <th>Flat No</th>
            <th>Owner Name</th>
            <th>Area</th>
            <th>Email</th>
            <th>Site</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(flats) && flats.length > 0 ? (
            flats.map((flat) => {
              const site = siteMasters.find((site) => site.id === flat.siteMasterId);
              return (
                <tr key={flat.id}>
                  <td>{flat.flatNo}</td>
                  <td>{flat.ownerName}</td>
                  <td>{flat.area}</td>
                  <td>{flat.emailId}</td>
                  <td>{site ? site.name : 'Site Not Found'}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(flat)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No flats available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Adding/Editing Flats */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Flat' : 'Add New Flat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Flat No</label>
            <input
              type="text"
              className="form-control"
              name="flatNo"
              value={newFlat.flatNo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              className="form-control"
              name="ownerName"
              value={newFlat.ownerName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Area</label>
            <input
              type="text"
              className="form-control"
              name="area"
              value={newFlat.area}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="emailId"
              value={newFlat.emailId}
              onChange={handleChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={isEdit ? handleUpdate : handleCreate}
          >
            {isEdit ? 'Update Flat' : 'Create Flat'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlatMaster;




















// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {
//   setFlats,
//   setLoading,
//   setError,
//   addFlat,
//   updateFlat,
//   selectFlats,
//   selectLoading,
//   selectError
// } from '../redux/Features/FlatSlice';
// import {
//   createFlatMaster,
//   getFlatMasterById,
//   updateFlatMaster
// } from '../Api/FlatApi/FlatApi';
// import { getStates } from '../Api/stateapi/stateMasterApi';
// import { setStateMasters } from '../redux/Features/stateMasterSlice';
// import { getAllSiteMastersByState } from '../Api/SiteApi/SiteApi';
// import { setSiteMasters } from '../redux/Features/siteMasterSlice';

// const FlatMaster = () => {
//   const dispatch = useDispatch();
//   const flats = useSelector(selectFlats) || [];
//   const loading = useSelector(selectLoading);
//   const error = useSelector(selectError);

//   const stateMasters = useSelector((state) => state.stateMaster.stateMasters) || [];
//   const siteMasters = useSelector((state) => state.siteMaster.data) || [];

//   const [showModal, setShowModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [flatId, setFlatId] = useState(null);
//   const [selectedStateId, setSelectedStateId] = useState(null); // State ID
//   const [selectedSiteId, setSelectedSiteId] = useState(null); // Site ID

//   const [newFlat, setNewFlat] = useState({
//     flatNo: '',
//     ownerName: '',
//     area: '',
//     emailId: '',
//     siteMasterId: 1,
//     creditDays: 30,
//     remark: '',
//     openingBalance: 0,
//   });

//   // Fetch states on component mount
//   useEffect(() => {
//     if (stateMasters.length === 0) {
//       fetchStates();
//     }
//   }, [stateMasters]);

//   const fetchStates = async () => {
//     try {
//       const states = await getStates();
//       dispatch(setStateMasters(states));
//     } catch (err) {
//       dispatch(setError(err.message));
//     }
//   };

//   // Fetch sites based on selected state
//   useEffect(() => {
//     if (selectedStateId) {
//       fetchSites(selectedStateId);
//     }
//   }, [selectedStateId]);

//   const fetchSites = async (stateId) => {
//     dispatch(setLoading('loading'));
//     try {
//       const response = await getAllSiteMastersByState(stateId);
//       dispatch(setSiteMasters(response.data));
//     } catch (err) {
//       dispatch(setError(err.message));
//     } finally {
//       dispatch(setLoading('succeeded'));
//     }
//   };

//   // Fetch flats based on selected site
//   useEffect(() => {
//     if (selectedSiteId) {
//       fetchFlats(selectedSiteId);
//     }
//   }, [selectedSiteId]);

//   const fetchFlats = async (siteId) => {
//     dispatch(setLoading('loading'));
//     try {
//       const response = await getFlatMasterById(siteId);
//       console.log(response);
//       dispatch(setFlats(response));
//     } catch (err) {
//       dispatch(setError(err.message));
//     } finally {
//       dispatch(setLoading('succeeded'));
//     }
//   };

//   // Handle changes in input fields for creating/updating flat
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewFlat((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle the creation of a new flat
//   const handleCreate = async () => {
//     dispatch(setLoading('loading'));
//     try {
//       const createdFlat = await createFlatMaster(newFlat);
//       dispatch(addFlat(createdFlat));
//       setShowModal(false);
//       resetNewFlat();
//     } catch (err) {
//       dispatch(setError(err.message));
//     } finally {
//       dispatch(setLoading('succeeded'));
//     }
//   };

//   // Reset new flat fields
//   const resetNewFlat = () => {
//     setNewFlat({
//       flatNo: '',
//       ownerName: '',
//       area: '',
//       emailId: '',
//       siteMasterId: selectedSiteId || 1,
//       creditDays: 30,
//       remark: '',
//       openingBalance: 0,
//     });
//   };
//   // Handle flat updates
//   const handleUpdate = async () => {
//     dispatch(setLoading('loading'));
//     try {
//       const updatedFlat = await updateFlatMaster(flatId, newFlat);
//       dispatch(updateFlat(updatedFlat));
//       setShowModal(false);
//     } catch (err) {
//       dispatch(setError(err.message));
//     } finally {
//       dispatch(setLoading('succeeded'));
//     }
//   };

//   // Open modal in edit mode
//   const handleEdit = (flat) => {
//     setNewFlat(flat);
//     setFlatId(flat.id);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   return (
//     <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
//       <div className="flex gap-3 justify-between items-center mb-6">
//         <h1 className="text-white text-4xl">Flats</h1>
//         <div className="flex gap-3">
//           <Button
//             variant="primary"
//             onClick={() => {
//               setIsEdit(false);
//               setShowModal(true);
//             }}
//           >
//             Add New Flat
//           </Button>

//           {/* Dropdown for selecting state */}
//           <Dropdown onSelect={(e) => setSelectedStateId(e)}>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//             {selectedStateId? stateMasters.find((state) => state.id === parseInt(selectedStateId))?.name: 'Select State'}
              
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               {stateMasters.map((state) => (
//                 <Dropdown.Item key={state.id} eventKey={state.id}>
//                   {state.name}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>

//           {/* Dropdown for selecting site */}
//           <Dropdown onSelect={(e) => setSelectedSiteId(e)}>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//             {selectedSiteId? siteMasters.find((site) => site.id === parseInt(selectedSiteId))?.name: 'Select Site'}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               {siteMasters.map((site) => (
//                 <Dropdown.Item key={site.id} eventKey={site.id}>
//                   {site.name}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}

//       <Table striped bordered hover className="w-full">
//         <thead>
//           <tr>
//             <th>Flat No</th>
//             <th>Owner Name</th>
//             <th>Area</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {flats.length > 0 ? (
//             flats.map((flat) => (
//               <tr key={flat.id}>
//                 <td>{flat.flatNo}</td>
//                 <td>{flat.ownerName}</td>
//                 <td>{flat.area}</td>
//                 <td>{flat.emailId}</td>
//                 <td>
//                   <Button variant="warning" onClick={() => handleEdit(flat)}>
//                     Edit
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center">
//                 No flats available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEdit ? 'Edit Flat' : 'Add New Flat'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               isEdit ? handleUpdate() : handleCreate();
//             }}
//           >
//             <div className="mb-3">
//               <label className="form-label">Flat No</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="flatNo"
//                 value={newFlat.flatNo}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Owner Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="ownerName"
//                 value={newFlat.ownerName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Area</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="area"
//                 value={newFlat.area}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 name="emailId"
//                 value={newFlat.emailId}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Opening Balance</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="openingBalance"
//                 value={newFlat.openingBalance}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Credit Days</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="creditDays"
//                 value={newFlat.creditDays}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Remarks</label>
//               <textarea
//                 className="form-control"
//                 name="remark"
//                 value={newFlat.remark}
//                 onChange={handleChange}
//               />
//             </div>

//             <Button type="submit" variant="primary">
//               {isEdit ? 'Update Flat' : 'Create Flat'}
//             </Button>
//           </form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default FlatMaster;
