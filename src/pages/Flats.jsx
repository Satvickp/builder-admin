import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Dropdown, FormControl } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  setFlats,
  setLoading,
  setError,
  addFlat,
  updateFlat,
  selectFlats,
  selectLoading,
  selectError,
} from '../redux/Features/FlatSlice';
import {
  createFlatMaster,
  getFlatsBySiteAndState,
  updateFlatMaster,
} from '../Api/FlatApi/FlatApi';
import { getStates } from '../Api/stateapi/stateMasterApi';
import { setStateMasters } from '../redux/Features/stateMasterSlice';
import { getAllSiteMastersByState, createSiteMaster } from '../Api/SiteApi/SiteApi';
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
    siteMasterId: null,
    creditDays: 30,
    remark: '',
    openingBalance: 0,
  });

  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [siteSearchQuery, setSiteSearchQuery] = useState('');

  useEffect(() => {
    if (stateMasters.length === 0) fetchStates();
  }, [stateMasters]);

  useEffect(() => {
    if (selectedStateId) fetchSites(selectedStateId);
  }, [selectedStateId]);

  useEffect(() => {
    if (selectedSiteId && selectedStateId) fetchFlats(selectedSiteId, selectedStateId);
  }, [selectedSiteId, selectedStateId]);

  const fetchStates = async () => {
    try {
      const states = await getStates();
      dispatch(setStateMasters(states));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

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

  const fetchFlats = async (siteId, stateId) => {
    dispatch(setLoading('loading'));
    try {
      const response = await getFlatsBySiteAndState(siteId, stateId);
      dispatch(
        setFlats({
          flats: response.content,
          totalElement: response.totalElement,
          page: response.page,
        })
      );
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
    if (!selectedSiteId) {
      alert('Please select or add a site before adding a flat.');
      return;
    }

    dispatch(setLoading('loading'));
    try {
      const createdFlat = await createFlatMaster({ ...newFlat, siteMasterId: selectedSiteId });
      dispatch(addFlat(createdFlat));
      setShowModal(false);
      resetNewFlat();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading('succeeded'));
    }
  };

  const handleAddNewSite = async (siteName) => {
    dispatch(setLoading('loading'));
    try {
      const newSite = { name: siteName, stateId: selectedStateId };
      const response = await createSiteMaster(newSite);
      dispatch(setSiteMasters([...siteMasters, response.data]));
      setSelectedSiteId(response.data.id);
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
      siteMasterId: null,
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

  const filteredStates = stateMasters.filter((state) =>
    state.name.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );
  const filteredSites = siteMasters.filter((site) =>
    site.name.toLowerCase().includes(siteSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h1 className="text-white text-4xl">Flats</h1>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => { setIsEdit(false); setShowModal(true); }}>
            Add New Flat
          </Button>

          {/* State Dropdown */}
          <Dropdown onSelect={(e) => setSelectedStateId(e)}>
            <Dropdown.Toggle variant="success">
              {selectedStateId
                ? stateMasters.find((state) => state.id === parseInt(selectedStateId))?.name
                : 'Select State'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <FormControl
                type="text"
                placeholder="Search State"
                value={stateSearchQuery}
                onChange={(e) => setStateSearchQuery(e.target.value)}
              />
              {filteredStates.map((state) => (
                <Dropdown.Item key={state.id} eventKey={state.id}>
                  {state.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Site Dropdown */}
          <Dropdown onSelect={(e) => setSelectedSiteId(e)}>
            <Dropdown.Toggle variant="success">
              {selectedSiteId
                ? siteMasters.find((site) => site.id === parseInt(selectedSiteId))?.name
                : 'Select Site'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <FormControl
                type="text"
                placeholder="Search or Add New Site"
                value={siteSearchQuery}
                onChange={(e) => setSiteSearchQuery(e.target.value)}
              />
              {filteredSites.map((site) => (
                <Dropdown.Item key={site.id} eventKey={site.id}>
                  {site.name}
                </Dropdown.Item>
              ))}
              {siteSearchQuery &&
                !filteredSites.find(
                  (site) => site.name.toLowerCase() === siteSearchQuery.toLowerCase()
                ) && (
                  <Dropdown.Item onClick={() => handleAddNewSite(siteSearchQuery)}>
                    Add New Site: {siteSearchQuery}
                  </Dropdown.Item>
                )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Table */}
      <Table striped bordered hover>
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
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                      <Button
                        variant="link"
                        className="p-0 text-primary"
                        onClick={() => handleEdit(flat)}
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {loading === 'loading' ? 'Loading...' : 'No Flats Found'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Flat' : 'Add New Flat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label>Flat No</label>
              <input
                type="text"
                className="form-control"
                name="flatNo"
                value={newFlat.flatNo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Owner Name</label>
              <input
                type="text"
                className="form-control"
                name="ownerName"
                value={newFlat.ownerName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Area</label>
              <input
                type="text"
                className="form-control"
                name="area"
                value={newFlat.area}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="emailId"
                value={newFlat.emailId}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Opening Balance</label>
              <input
                type="number"
                className="form-control"
                name="openingBalance"
                value={newFlat.openingBalance}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Remarks</label>
              <textarea
                className="form-control"
                name="remark"
                value={newFlat.remark}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={isEdit ? handleUpdate : handleCreate}>
            {isEdit ? 'Update Flat' : 'Add Flat'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlatMaster;
