import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setFlats, setLoading, setError, addFlat, updateFlat, selectFlats, selectLoading, selectError } from './redux/Features/FlatSlice';
import { createFlatMaster, getFlatMasterById, updateFlatMaster } from './redux/Features/FlatApi/FlatApi';

const FlatMaster = () => {
  const dispatch = useDispatch();
  const flats = useSelector(selectFlats) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const SiteData = useSelector((state) => state.siteMaster);
  const { data } = SiteData || {};
  console.log(data);

  // State for selected site ID and name
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedSiteName, setSelectedSiteName] = useState("Select Site"); // Default label

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flatId, setFlatId] = useState(null);

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

  const fetchFlats = async () => {
    dispatch(setLoading('loading'));
    if (!flats.length && flatId) {
      try {
        const response = await getFlatMasterById(selectedSiteId);
        dispatch(setFlats(response || []));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading('succeeded'));
      }
    }
  };

  useEffect(() => {
    console.log("1")
    //fetchFlats();
    if  (selectedSiteId) fetchFlats(selectedSiteId);
  }, [selectedSiteId]);

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
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading('succeeded'));
    }
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

  const handleSiteSelect = (id) => {
    setSelectedSiteId(id);
    const selectedSite = data.find((site) => site.id === id);
    setSelectedSiteName(selectedSite ? selectedSite.name : "Select Site"); // Update button label
  };

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Flats</h1>
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="px-3"
            onClick={() => {
              setIsEdit(false);
              setShowModal(true);
            }}
          >
            Add New Flat
          </Button>
          <Dropdown onSelect={(eventKey) => handleSiteSelect(eventKey)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              select Site {" "}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {data && data.map((item) => (
                <Dropdown.Item key={item.id} eventKey={item.id}>
                  {item.name} {/* Display site name */}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <Table striped bordered hover className="w-full">
        <thead>
          <tr>
            <th>Flat No</th>
            <th>Owner Name</th>
            <th>Area</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flats.length > 0 ? (
            flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.flatNo}</td>
                <td>{flat.ownerName}</td>
                <td>{flat.area}</td>
                <td>{flat.emailId}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(flat)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No flats available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}
        className='mt-40'>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Flat' : 'Add New Flat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEdit ? handleUpdate() : handleCreate();
            }}
          >
            <div className="mb-3">
              <label className="form-label">Flat No</label>
              <input
                type="text"
                className="form-control"
                name="flatNo"
                value={newFlat.flatNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Owner Name</label>
              <input
                type="text"
                className="form-control"
                name="ownerName"
                value={newFlat.ownerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Area</label>
              <input
                type="text"
                className="form-control"
                name="area"
                value={newFlat.area}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                className="form-control"
                name="emailId"
                value={newFlat.emailId}
                onChange={handleChange}
                required
              />
            </div>
            <Button variant="primary" type="submit">
              {isEdit ? 'Update Flat' : 'Add Flat'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FlatMaster;
