// src/components/SiteMaster.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";

import {
  setSiteMasters,
  setLoading,
  setError,
} from "./redux/Features/siteMasterSlice";

import {
  createSiteMaster,
  updateSiteMaster,
  getAllSiteMastersByState,
} from "./redux/Features/SiteApi/SiteApi";

const SiteMaster = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.siteMaster);
  const StateData = useSelector((state) => state.stateMaster);
  const { stateMasters } = StateData;

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [siteId, setSiteId] = useState(null);
  const [stateId, setStateId] = useState(null);

  const [newSite, setNewSite] = useState({
    name: "",
    totalUnits: "",
    monthlyChargesType: 0,
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
    if (stateId) fetchSiteMasters(stateId);
  }, [stateId]);

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
        monthlyChargesType: 0,
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
      setNewSite({ name: "", totalUnits: "", flatTypes: [], stateMasterId: stateId || 1 });
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleEdit = (site) => {
    setNewSite(site);
    setSiteId(site.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleStateSelect = (id) => {
    setStateId(id);
  };

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Site</h1>
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="px-3"
            onClick={() => {
              setIsEdit(false);
              setShowModal(true);
            }}
          >
            Add New Site
          </Button>
          <Dropdown onSelect={(eventKey) => handleStateSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select State {" "}
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

      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

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
                  </Button>{" "}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No site masters available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>


      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="mt-40"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit Site Master" : "Add New Site Master"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEdit ? handleUpdate() : handleCreate();
            }}
          >
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
                placeholder="Separate by commas (e.g., 1000, 1500)"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">State Master ID</label>
              <input
                type="number"
                className="form-control"
                name="stateMasterId"
                value={newSite.stateMasterId}
                onChange={handleChange}
                required
              />
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
