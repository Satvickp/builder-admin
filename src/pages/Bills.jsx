import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  addBill,
  setError,
  setLoading,
  setBills,
} from '../redux/Features/BillSlice';
import {
  createBill,
  deleteBill as apiDeleteBill,
  markBillAsPaid,
  markBillAsUnpaid,
} from '../Api/BillApi/BillApi';
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

  const [showModal, setShowModal] = useState(false);
  const [newBill, setNewBill] = useState({
    stateId: '',
    siteId: '',
    flatId: '',
    serviceId: '',
  });

  const [pendingBills, setPendingBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);

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
      dispatch(setError('Failed to load states.'));
    }
  };

  useEffect(() => {
    fetchServices();
  }, [showModal]);

  const fetchServices = async () => {
    try {
      const response = await getAllServiceMasters();
      dispatch(setServiceMasters(response.data));
    } catch (err) {
      dispatch(setError('Failed to load services.'));
    }
  };

  useEffect(() => {
    if (newBill.stateId) {
      fetchSites(newBill.stateId);
    }
  }, [newBill.stateId]);

  const fetchSites = async (stateId) => {
    dispatch(setLoading(true));
    try {
      const response = await getAllSiteMastersByState(stateId);
      dispatch(setSiteMasters(response.data));
    } catch (err) {
      dispatch(setError('Failed to load sites.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (newBill.siteId && newBill.stateId) {
      fetchFlats(newBill.stateId, newBill.siteId);
      fetchPendingBills(newBill.siteId);
      fetchPaidBills(newBill.siteId);
    }
  }, [newBill.siteId, newBill.stateId]);

  const fetchFlats = async (stateId, siteId) => {
    dispatch(setLoading(true));
    try {
      const response = await getFlatsBySiteAndState(stateId, siteId);
      dispatch(setFlats({
        flats: response.content,
        totalElement: response.totalElement,
        page: response.page,
      }));
    } catch (err) {
      dispatch(setError('Failed to load flats.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchPendingBills = async (siteId) => {
    try {
      const response = await getPendingBillsBySiteId(siteId);
      setPendingBills(response.data);
    } catch (err) {
      dispatch(setError('Failed to load pending bills.'));
    }
  };

  const fetchPaidBills = async (siteId) => {
    try {
      const response = await getAllPaidBillsBySiteId(siteId);
      setPaidBills(response.data);
    } catch (err) {
      dispatch(setError('Failed to load paid bills.'));
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewBill({
      stateId: '',
      siteId: '',
      flatId: '',
      serviceId: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Ensure that stateId, siteId, flatId, and serviceId are stored as numbers
    setNewBill({
      ...newBill,
      [name]: type === 'checkbox' ? checked : (value ? Number(value) : ''),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await createBill(newBill);
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

  // Handle Mark as Paid action
  const handleMarkAsPaid = async (id) => {
    try {
      await markBillAsPaid(id);
      dispatch(setBills(bills.map(bill => 
        bill.id === id ? { ...bill, paid: true } : bill
      )));
    } catch (err) {
      dispatch(setError('Failed to mark bill as paid.'));
    }
  };

  // Handle Mark as Unpaid action
  const handleMarkAsUnpaid = async (id) => {
    try {
      await markBillAsUnpaid(id);
      dispatch(setBills(bills.map(bill => 
        bill.id === id ? { ...bill, paid: false } : bill
      )));
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
        <Button variant="primary" onClick={openModal}>Add New Bill</Button>
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
                <td>{bill.amountBeforeGst}</td>
                <td>{bill.sgstAmount}</td>
                <td>{bill.cgstAmount}</td>
                <td>{bill.igstAmount}</td>
                <td>{bill.amountAfterGst}</td>
                <td>{bill.paid ? "Paid" : "Unpaid"}</td>
                <td>
                  {!bill.paid ? (
                    <Button
                      variant="success"
                      onClick={() => handleMarkAsPaid(bill.id)}
                      className='mr-2'
                    >
                      Mark as Paid
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => handleMarkAsUnpaid(bill.id)}
                      className='mr-2'
                    >
                      Mark as Unpaid
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteBill(bill.id)}
                    className='mr-2'
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="stateId">
              <Form.Label>State</Form.Label>
              <Form.Control
                as="select"
                name="stateId"
                value={newBill.stateId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select State</option>
                {stateMasters.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="siteId">
              <Form.Label>Site</Form.Label>
              <Form.Control
                as="select"
                name="siteId"
                value={newBill.siteId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Site</option>
                {siteMasters.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="flatId">
              <Form.Label>Flat</Form.Label>
              <Form.Control
                as="select"
                name="flatId"
                value={newBill.flatId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Flat</option>
                {flats.map((flat) => (
                  <option key={flat.id} value={flat.id}>
                    {flat.flatNo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="serviceId">
              <Form.Label>Service</Form.Label>
              <Form.Control
                as="select"
                name="serviceId"
                value={newBill.serviceId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BillManager;
