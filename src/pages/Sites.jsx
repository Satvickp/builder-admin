import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Pagination, FormGroup } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  setSiteMasters,
  setLoading,
  setError,
  deleteSiteMaster,
} from "../redux/Features/siteMasterSlice";
import {
  createSiteMaster,
  updateSiteMaster,
  getAllSiteMasters,
  deleteSite,
} from "../Api/SiteApi/SiteApi";
import { setStateMasters } from "../redux/Features/stateMasterSlice";

const SiteMaster = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.siteMaster);
  const { stateMasters } = useSelector((state) => state.stateMaster);
  const cred = useSelector((state) => state.Cred);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSite, setNewSite] = useState({
    name: "",
    totalUnits: "",
    flatTypes: [],
    stateMasterId: 1,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalPages: 1,
    sortBy: "createdTime",
    sortDirection: "desc",
  });

  // Fetch sites with pagination and sorting
  const fetchSites = async () => {
    try {
      dispatch(setLoading());
      const response = await getAllSiteMasters(
        cred.id,
        pagination.page,
        pagination.pageSize,
        pagination.sortBy,
        pagination.sortDirection
      );
      dispatch(setSiteMasters(response.content || []));
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
      }));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleStateSelect = (id) => {
    setStateId(id);
    setNewSite({
      ...newSite,
      stateMasterId: id,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSite({ ...newSite, [name]: value });
  };

  const handleCreate = async () => {
    dispatch(setLoading());
    try {

      await createSiteMaster({
        ...newSite,
        builderId: cred.id,
        totalUnits: Number(newSite.totalUnits),
        stateMasterId: Number(newSite.stateMasterId),
      });
      fetchSites();
      setShowModal(false);
      setNewSite({
        name: "",
        totalUnits: "",
        flatTypes: [],
        stateMasterId: stateId || 1,
      });
    } catch (err) {
      dispatch(setError(err.message));
    }
  };


  const handleUpdate = async () => {
    dispatch(setLoading());
    try {

      await updateSiteMaster(siteId, {
        ...newSite,
        builderId: cred.id,
        totalUnits: Number(newSite.totalUnits),
        stateMasterId: Number(newSite.stateMasterId),
      });
      fetchSites();
      setShowModal(false);
      setNewSite({
        name: "",
        totalUnits: "",
        flatTypes: [],
        stateMasterId: stateId || 1,
      });
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleEdit = (site) => {
    setNewSite({
      ...site,
      stateMasterId: site.stateMasterId,
    });
    setSiteId(site.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      dispatch(setLoading());
      try {
        await deleteSite(id);
        dispatch(deleteSiteMaster(id));
        fetchSites();
      } catch (err) {
        dispatch(setError(err.message));
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, page: pageNumber }));
  };

  useEffect(() => {
    fetchSites();
  }, [pagination.page]);

  const filteredStateMasters = stateMasters.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Site Master</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New
        </Button>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Site</th>
            <th>Total Units</th>
            <th>Flat Types</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((site) => (
              <tr key={site.id}>
                <td>{site.name}</td>
                <td>{site.totalUnits}</td>
                <td>{site.flatTypes.join(", ")}</td>
                <td>
                  {
                    stateMasters.find((state) => state.id === site.stateMasterId)
                      ?.name || "Unknown"
                  }
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                    <Button
                      variant="link"
                      className="p-0 text-primary"
                      onClick={() => handleEdit(site)}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={() => handleDelete(site.id)}
                    >
                      <FaTrash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination className="mt-3">
        <Pagination.First
          onClick={() => handlePageChange(0)}
          disabled={pagination.page === 0}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 0}
        />
        {Array.from({ length: pagination.totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index === pagination.page}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page + 1 === pagination.totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(pagination.totalPages - 1)}
          disabled={pagination.page + 1 === pagination.totalPages}
        />
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Site Master" : "Add New Site Master"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="stateSelect">
              <Form.Label>Select State</Form.Label>
              <Form.Control
                as="select"
                value={stateId || ""}
                onChange={(e) => handleStateSelect(e.target.value)}
              >
                <option value="" disabled>
                  Select State
                </option>
                {filteredStateMasters.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Site Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newSite.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Total Units</Form.Label>
                <Form.Control
                  type="number"
                  name="totalUnits"
                  value={newSite.totalUnits}
                  onChange={(e) => {
                    setNewSite({ ...newSite, totalUnits: e.target.value });
                  }}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Flat Types</Form.Label>
                <Form.Control
                  type="text"
                  name="flatTypes"
                  value={newSite.flatTypes.join(", ")}
                  onChange={(e) =>
                    setNewSite({
                      ...newSite,
                      flatTypes: e.target.value.split(",").map((item) => item.trim())
                    })
                  }
                  placeholder="e.g., 1000, 2000, 5000"
                />
              </Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={isEdit ? handleUpdate : handleCreate}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SiteMaster;























// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, Button, Modal, Form } from "react-bootstrap";
// import { FaEdit } from "react-icons/fa";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import Dropdown from "react-bootstrap/Dropdown";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { setStateMasters } from "../redux/Features/stateMasterSlice";
// import { setSiteMasters, setLoading, setError } from "../redux/Features/siteMasterSlice";
// import {
//   createSiteMaster,
//   updateSiteMaster,
//   getAllSiteMasters,
//   getAllSiteMastersByState,
// } from "../Api/SiteApi/SiteApi";
// import { getStates } from "../Api/stateapi/stateMasterApi";

// const SiteMaster = () => {
//   const dispatch = useDispatch();
//   const { data, status, error } = useSelector((state) => state.siteMaster);
//   const { stateMasters } = useSelector((state) => state.stateMaster);

//   const [showModal, setShowModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [siteId, setSiteId] = useState(null);
//   const [stateId, setStateId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [newSite, setNewSite] = useState({
//     name: "",
//     totalUnits: "",
//     flatTypes: [],
//     stateMasterId: null,
//   });

//   // Fetch site data (all or by state)
//   const fetchSiteMasters = async (id = null) => {
//     dispatch(setLoading());
//     try {
//       const response = id
//         ? await getAllSiteMastersByState(id)
//         : await getAllSiteMasters(); // Fetch all sites if no state selected
//       dispatch(setSiteMasters(response.data));
//     } catch (err) {
//       dispatch(setError(err.message));
//     }
//   };

//   // Fetch all states
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const states = await getStates();
//         dispatch(setStateMasters(states));
//       } catch (err) {
//         dispatch(setError(err.message));
//       }
//     };
//     if (stateMasters.length === 0) fetchStates();
//   }, [dispatch, stateMasters.length]);

//   // Fetch site data based on state selection
//   useEffect(() => {
//     fetchSiteMasters(stateId);
//   }, [stateId]);

//   const handleStateSelect = (id) => {
//     setStateId(id);
//     setNewSite({
//       ...newSite,
//       stateMasterId: id,
//     });
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewSite({ ...newSite, [name]: value });
//   };

//   const handleCreate = async () => {
//     dispatch(setLoading());
//     try {
//       await createSiteMaster(newSite);
//       fetchSiteMasters(stateId);
//       setShowModal(false);
//       setNewSite({
//         name: "",
//         totalUnits: "",
//         flatTypes: [],
//         stateMasterId: stateId || null,
//       });
//     } catch (err) {
//       dispatch(setError(err.message));
//     }
//   };

//   const handleUpdate = async () => {
//     dispatch(setLoading());
//     try {
//       await updateSiteMaster(siteId, newSite);
//       fetchSiteMasters(stateId);
//       setShowModal(false);
//       setNewSite({
//         name: "",
//         totalUnits: "",
//         flatTypes: [],
//         stateMasterId: stateId || null,
//       });
//     } catch (err) {
//       dispatch(setError(err.message));
//     }
//   };

//   const handleEdit = (site) => {
//     setNewSite({
//       ...site,
//       stateMasterId: site.stateMasterId,
//     });
//     setSiteId(site.id);
//     setIsEdit(true);
//     setShowModal(true);
//   };

//   // Filter state masters based on the search term
//   const filteredStateMasters = stateMasters.filter((state) =>
//     state.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
//       <div className="flex gap-3 justify-between items-center mb-6">
//         <h1 className="text-white text-4xl">Site</h1>
//         <div className="flex gap-3">
//           <Button
//             variant="primary"
//             className="px-3"
//             onClick={() => setShowModal(true)}
//           >
//             Add New
//           </Button>
//           <Dropdown>
//             <Dropdown.Toggle variant="success" id="dropdown-basic">
//               {stateMasters.find((state) => state.id === parseInt(stateId))?.name || "All States"}
//             </Dropdown.Toggle>
//             <Dropdown.Menu flip={false}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search states..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//               <Dropdown.Item onClick={() => handleStateSelect(null)}>
//                 All States
//               </Dropdown.Item>
//               {filteredStateMasters.map((item) => (
//                 <Dropdown.Item key={item.id} onClick={() => handleStateSelect(item.id)}>
//                   {item.name}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </div>

//       {status === "loading" && <p>loading...</p>}
//       {error && <p style={{ color: "red" }}>error: {error}</p>}

//       <div className="table-container" style={{ maxHeight: "900px", overflowY: "auto" }}>
//         <Table striped bordered hover className="w-full">
//           <thead>
//             <tr>
//               <th>Site</th>
//               <th>Total Units</th>
//               <th>Flat Types</th>
//               <th>State</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.length > 0 ? (
//               data.map((site) => (
//                 <tr key={site.id}>
//                   <td>{site.name}</td>
//                   <td>{site.totalUnits}</td>
//                   <td>{site.flatTypes.join(", ")}</td>
//                   <td>
//                     {
//                       stateMasters.find((state) => state.id === site.stateMasterId)?.name || "Unknown State"
//                     }
//                   </td>
//                   <td>
//                     <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
//                       <Button
//                         variant="link"
//                         className="p-0 text-primary"
//                         onClick={() => handleEdit(site)}
//                       >
//                         <FaEdit size={30} />
//                       </Button>
//                     </OverlayTrigger>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default SiteMaster;

