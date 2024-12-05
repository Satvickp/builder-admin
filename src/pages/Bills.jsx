import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addBill, setError, setLoading, setBills } from '../redux/Features/BillSlice';
import { createBillsInBulkWithoutFlatId, deleteBill as apiDeleteBill, markBillAsPaid, markBillAsUnpaid } from '../Api/BillApi/BillApi';
import { getStates } from '../Api/stateapi/stateMasterApi';
import { setStateMasters } from '../redux/Features/stateMasterSlice';
import { getAllSiteMastersByState } from '../Api/SiteApi/SiteApi';
import { setSiteMasters } from '../redux/Features/siteMasterSlice';
import { getFlatsBySiteAndState } from '../Api/FlatApi/FlatApi';
import { setFlats } from '../redux/Features/FlatSlice';
import { getAllServiceMasters } from '../Api/ServicesApi/ServiceApi';
import { setServiceMasters } from '../redux/Features/ServiceSlice';
import { getPendingBillsBySiteId, getAllPaidBillsBySiteId } from '../Api/BillApi/BillApi';

const BillManager = () => {
  const dispatch = useDispatch();
  const bills = useSelector(state => state.bills.bills);
  const loading = useSelector(state => state.bills.loading);
  const error = useSelector(state => state.bills.error);
  const stateMasters = useSelector(state => state.stateMaster.stateMasters) || [];
  const siteMasters = useSelector(state => state.siteMaster.data) || [];
  const flats = useSelector(state => state.flat.flats || []);
  const services = useSelector(state => state.serviceMasters.services) || [];
  const cred = useSelector(state => state.Cred);

  const [showModal, setShowModal] = useState(false); // For first modal
  const [showModal1, setShowModal1] = useState(false); // For second modal
  const [newBill, setNewBill] = useState({ stateId: '', siteId: '', flatId: '', serviceId: '' });
  const [billList, setBillList] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);

  useEffect(() => {
    if (stateMasters.length === 0) {
      fetchStates();
    }
  }, [stateMasters]);

  const fetchStates = async () => {
    try {
      const states = await getStates(cred.id);
      dispatch(setStateMasters(states));
    } catch (err) {
      dispatch(setError('Failed to load states.'));
    }
  };

  useEffect(() => {
    fetchServices();
  }, [showModal, showModal1]);

  const fetchServices = async () => {
    try {
      const response = await getAllServiceMasters(cred.id);
      dispatch(setServiceMasters(response.data));
    } catch (err) {
      dispatch(setError('Failed to load services.'));
    }
  };

  const fetchSites = async (stateId) => {
    dispatch(setLoading(true));
    try {
      const response = await getAllSiteMastersByState(stateId, cred.id);
      dispatch(setSiteMasters(response.data));
    } catch (err) {
      dispatch(setError('Failed to load sites.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (newBill.stateId) {
      fetchSites(newBill.stateId);
    }
  }, [newBill.stateId]);

  const fetchFlats = async (stateId, siteId) => {
    dispatch(setLoading(true));
    try {
      const response = await getFlatsBySiteAndState(siteId, stateId, cred.id);
      dispatch(setFlats({ flats: response.content, totalElement: response.totalElement, page: response.page }));
    } catch (err) {
      dispatch(setError('Failed to load flats.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchPendingBills = async (siteId) => {
    try {
      const response = await getPendingBillsBySiteId(siteId, cred.id);
      setPendingBills(response.data);
    } catch (err) {
      dispatch(setError('Failed to load pending bills.'));
    }
  };

  const fetchPaidBills = async (siteId) => {
    try {
      const response = await getAllPaidBillsBySiteId(siteId, cred.id);
      setPaidBills(response.data);
    } catch (err) {
      dispatch(setError('Failed to load paid bills.'));
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewBill({ stateId: '', siteId: '', serviceId: '' });
  };

  const openModal1 = () => setShowModal1(true);
  const closeModal1 = () => {
    setShowModal1(false);
    setNewBill({ stateId: '', siteId: '', flatId: '', serviceId: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBill({ ...newBill, [name]: type === 'checkbox' ? checked : (value ? Number(value) : '') });
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    setBillList([...billList, newBill]);
    setNewBill({ stateId: '', siteId: '', flatId: '', serviceId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await createBillsInBulkWithoutFlatId({ ...newBill, builderId: cred.id });
      dispatch(addBill(response.data));
      closeModal();
    } catch (err) {
      dispatch(setError('Failed to create bill.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await apiDeleteBill(id);
      dispatch(setBills(bills.filter(bill => bill.id !== id)));
    } catch (err) {
      dispatch(setError('Failed to delete bill.'));
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await markBillAsPaid(id);
      dispatch(setBills(bills.map(bill => (bill.id === id ? { ...bill, paid: true } : bill))));
    } catch (err) {
      dispatch(setError('Failed to mark bill as paid.'));
    }
  };

  const handleMarkAsUnpaid = async (id) => {
    try {
      await markBillAsUnpaid(id);
      dispatch(setBills(bills.map(bill => (bill.id === id ? { ...bill, paid: false } : bill))));
    } catch (err) {
      dispatch(setError('Failed to mark bill as unpaid.'));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-4xl">Bill Manager</h2>
        <div className="flex gap-4">
          <Button variant="primary" onClick={openModal}>Add Bill in Bulk</Button>
          <Button variant="secondary" onClick={openModal1}>Add Bill or Flats</Button>
        </div>
      </div>
      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="table-container bg-white">
        <Table striped bordered hover variant="dark" className="table">
          <thead>
            <tr>
              <th>Bill Date</th>
              <th>Bill No</th>
              <th>Owner Name</th>
              <th>State Name</th>
              <th>Site Name</th>
              <th>Flat No</th>
              <th>Service Name</th>
              <th>Area</th>
              <th>Owner Email</th>
              <th>Amount Before GST</th>
              <th>SGST Amount</th>
              <th>CGST Amount</th>
              <th>IGST Amount</th>
              <th>Amount After GST</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{formatDate(bill.billDate)}</td>
                <td>{bill.billNo}</td>
                <td>{bill.ownerName}</td>
                <td>{bill.stateName}</td>
                <td>{bill.siteName}</td>
                <td>{bill.flatNo}</td>
                <td>{bill.serviceName}</td>
                <td>{bill.area}</td>
                <td>{bill.ownerEmail}</td>
                <td>{bill.amountBeforeGST}</td>
                <td>{bill.sgstAmount}</td>
                <td>{bill.cgstAmount}</td>
                <td>{bill.igstAmount}</td>
                <td>{bill.amountAfterGST}</td>
                <td>{bill.paid ? 'Paid' : 'Unpaid'}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteBill(bill.id)}>Delete</Button>
                  {bill.paid ? (
                    <Button variant="warning" onClick={() => handleMarkAsUnpaid(bill.id)}>Mark as Unpaid</Button>
                  ) : (
                    <Button variant="success" onClick={() => handleMarkAsPaid(bill.id)}>Mark as Paid</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal 1 */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bill in Bulk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="stateId">
              <Form.Label>Select State</Form.Label>
              <Form.Control as="select" name="stateId" value={newBill.stateId} onChange={handleInputChange}>
                <option value="">Select State</option>
                {stateMasters.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            
              <Form.Group className="mb-3" controlId="siteId">
                <Form.Label>Select Site</Form.Label>
                <Form.Control as="select" name="siteId" value={newBill.siteId} onChange={handleInputChange}>
                  <option value="">Select Site</option>
                  {siteMasters.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
          
          
              <Form.Group className="mb-3" controlId="serviceId">
                <Form.Label>Select Service</Form.Label>
                <Form.Control as="select" name="serviceId" value={newBill.serviceId} onChange={handleInputChange}>
                  <option value="">Select Service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
       
            <Button variant="primary" type="submit">Create Bill</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal 2 */}
      <Modal show={showModal1} onHide={closeModal1}>
        <Modal.Header closeButton>
          <Modal.Title>Add Bill or Flats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleAddBill}>
            {/* State Selection */}
            <div className="mb-3">
              <label htmlFor="stateId" className="form-label">Select State</label>
              <select
                id="stateId"
                name="stateId"
                value={newBill.stateId}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select State</option>
                {stateMasters.map((state) => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            </div>

            {/* Site Selection */}
            <div className="mb-3">
              <label htmlFor="siteId" className="form-label">Select Site</label>
              <select
                id="siteId"
                name="siteId"
                value={newBill.siteId}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select Site</option>
                {siteMasters.map((site) => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </div>

            {/* Flat Selection */}
            <div className="mb-3">
              <label htmlFor="flatId" className="form-label">Select Flat</label>
              <select
                id="flatId"
                name="flatId"
                value={newBill.flatId}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select Flat</option>
                {flats.map((flat) => (
                  <option key={flat.id} value={flat.id}>{flat.name}</option>
                ))}
              </select>
            </div>

            {/* Service Selection */}
            <div className="mb-3">
              <label htmlFor="serviceId" className="form-label">Select Service</label>
              <select
                id="serviceId"
                name="serviceId"
                value={newBill.serviceId}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">Add Bill</Button>
            </div>
          </form>

          {/* Table to Display Added Bills */}
          <div className="mt-4">
            <h5>Added Bills</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Site</th>
                  <th>Flat</th>
                  <th>Service</th>
                </tr>
              </thead>
              <tbody>
                {billList.map((bill, index) => (
                  <tr key={index}>
                    <td>{stateMasters.find(state => state.id === bill.stateId)?.name}</td>
                    <td>{siteMasters.find(site => site.id === bill.siteId)?.name}</td>
                    <td>{flats.find(flat => flat.id === bill.flatId)?.name}</td>
                    <td>{services.find(service => service.id === bill.serviceId)?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BillManager;
