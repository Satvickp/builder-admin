import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { setServiceMasters, setLoading, setError } from '../redux/Features/ServiceSlice';
import { createServiceMaster, updateServiceMaster, getAllServiceMasters } from '../Api/ServicesApi/ServiceApi';

const ServiceMaster = () => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.serviceMasters);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  const [newService, setNewService] = useState({
    name: '',
    SACCode: 'N', // Set default value of SACCode to 'N'
    cgst: '',
    sgst: '',
    igst: '',
  });

  const fetchServiceMasters = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllServiceMasters();
      dispatch(setServiceMasters(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchServiceMasters();
  }, []);

  useEffect(() => {
    if (isEdit && serviceId !== null) {
      // Populate form when in edit mode, set 'N' if SACCode is undefined
      const serviceToEdit = services.find(service => service.id === serviceId);
      if (serviceToEdit) {
        setNewService({
          name: serviceToEdit.name,
          SACCode: serviceToEdit.SACCode || 'N', // Use 'N' as default if SACCode is empty
          cgst: serviceToEdit.cgst,
          sgst: serviceToEdit.sgst,
          igst: serviceToEdit.igst,
        });
      }
    }
  }, [isEdit, serviceId, services]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: name === 'SACCode' || name === 'name' ? value : parseFloat(value) || '', // Keep name and SACCode as string
    }));
  };

  const handleCreate = async () => {
    dispatch(setLoading(true));
    try {
      await createServiceMaster(newService);
      fetchServiceMasters();
      setShowModal(false);
      resetForm();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdate = async () => {
    dispatch(setLoading(true));
    try {
      await updateServiceMaster(serviceId, newService);
      fetchServiceMasters();
      setShowModal(false);
      resetForm();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (service) => {
    setNewService(service);
    setServiceId(service.id);
    setIsEdit(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setNewService({ name: '', SACCode: 'N', cgst: '', sgst: '', igst: '' });
    setIsEdit(false);
    setServiceId(null);
  };

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex gap-3 justify-between items-center mb-6">
        <h2 className='text-white ml-4 text-4xl'>Service</h2>
        <Button variant="primary" className='w-80' onClick={() => { resetForm(); setShowModal(true); }}>
          Add New Service
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SAC Code</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>IGST</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{service.SACCode || 'N'}</td>
                <td>{service.cgst}%</td>
                <td>{service.sgst}%</td>
                <td>{service.igst}%</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(service)}>Edit</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No service masters available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} className='mt-40'>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Service Master' : 'Add New Service Master'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); isEdit ? handleUpdate() : handleCreate(); }}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={newService.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">SAC Code</label>
              <input type="text" className="form-control" name="SACCode" value={newService.SACCode} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">CGST (%)</label>
              <input type="number" className="form-control" name="cgst" value={newService.cgst} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">SGST (%)</label>
              <input type="number" className="form-control" name="sgst" value={newService.sgst} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">IGST (%)</label>
              <input type="number" className="form-control" name="igst" value={newService.igst} onChange={handleChange} required />
            </div>
            <Button variant="primary" type="submit">
              {isEdit ? 'Update Service Master' : 'Add Service Master'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ServiceMaster;
