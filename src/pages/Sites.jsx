import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import { setStateMasters } from "../redux/Features/stateMasterSlice";
import { setSiteMasters, setLoading, setError } from "../redux/Features/siteMasterSlice";
import { createSiteMaster, updateSiteMaster, getAllSiteMastersByState } from "../Api/SiteApi/SiteApi";
import { getStates } from "../Api/stateapi/stateMasterApi";

const SiteMaster = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.siteMaster);
  const { stateMasters } = useSelector((state) => state.stateMaster);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [stateId, setStateId] = useState(null);

  const [newSite, setNewSite] = useState({
    name: "",
    totalUnits: "",
    flatTypes: [],
    stateMasterId: 1,
  });

  const fetchSiteMasters = async (id) => {
    dispatch(setLoading());
    try {
      const response = await getAllSiteMastersByState(id); 
      dispatch(setSiteMasters(response.data));
    } catch (err) {
      dispatch(setError(err.message)); 
    }
  };

  useEffect(() => {
    if (stateMasters.length === 0) {
      fetchStates(); 
    }
  }, [dispatch, stateMasters.length]);

  const fetchStates = async () => {
    try {
      const states = await getStates(); 
      dispatch(setStateMasters(states)); 
    } catch (err) {
      dispatch(setError(err.message)); 
    }
  };

  useEffect(() => {
    if (stateId) {
      fetchSiteMasters(stateId); 
    }
  }, [stateId]);

  const handleStateSelect = (id) => {
    setStateId(id);
    setNewSite({
      ...newSite,
      stateMasterId: id, // Update stateMasterId when state is selected
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSite({ ...newSite, [name]: value });
  };

  const handleCreate = async () => {
    dispatch(setLoading());
    try {
      await createSiteMaster(newSite);
      fetchSiteMasters(stateId);
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
      await updateSiteMaster(siteId, newSite);
      fetchSiteMasters(stateId);
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
      stateMasterId: site.stateMasterId // Ensure the correct stateMasterId is set
    });
    setSiteId(site.id); 
    setIsEdit(true); 
    setShowModal(true); 
  };

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Site</h1>
        <div className="flex gap-3">
          <Button variant="primary" className="px-3" onClick={() => setShowModal(true)}>
            Add New Site
          </Button>
          <Dropdown onSelect={(eventKey) => handleStateSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {stateMasters.find((state) => state.id === parseInt(stateId))?.name || "Select State"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {stateMasters.map((item) => (
                <Dropdown.Item key={item.id} eventKey={item.id}>
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {status === "loading" && <p>loading...</p>}
      {error && <p style={{ color: "red" }}>error: {error}</p>}

      <Table striped bordered hover className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Total Units</th>
            <th>Flat Types</th>
            <th>State Master ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((site) => (
              <tr key={site.id}>
                <td>{site.id}</td>
                <td>{site.name}</td>
                <td>{site.totalUnits}</td>
                <td>{site.flatTypes.join(", ")}</td>
                <td>{site.stateMasterId}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(site)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} className="mt-40">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Site Master" : "Add New Site Master"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => {
              e.preventDefault();
              isEdit ? handleUpdate() : handleCreate();
            }}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={newSite.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total Units</label>
              <input
                type="number"
                className="form-control"
                name="totalUnits"
                value={newSite.totalUnits}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Flat Types</label>
              <input
                type="text"
                className="form-control"
                name="flatTypes"
                value={newSite.flatTypes.join(",")}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "flatTypes",
                      value: e.target.value.split(","),
                    },
                  })
                }
                placeholder="Comma separated (e.g., 1000, 1500)"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">State Master ID</label>
              <select
                className="form-control"
                name="stateMasterId"
                value={newSite.stateMasterId || ""}
                onChange={handleChange}
                required
              >
                {stateMasters.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="primary" type="submit">
              {isEdit ? "Update Site Master" : "Add Site Master"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SiteMaster;
