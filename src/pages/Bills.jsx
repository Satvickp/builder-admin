// src/components/BillManager.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are imported
import {
  addBill,
  setError,
  setLoading,
  removeBill,
  setBills,
  updateBill,
} from './redux/Features/BillSlice';
import {
  createBill as apiCreateBill,
  deleteBill as apiDeleteBill,
  markBillAsPaid,
  markBillAsUnpaid,
  getPendingBillsBySiteId,
} from './redux/Features/BillApi/BillApi';

const BillManager = () => {
  const dispatch = useDispatch();
  const bills = useSelector(state => state.bills.bills);
  const loading = useSelector(state => state.bills.loading);
  const error = useSelector(state => state.bills.error);

  const [showModal, setShowModal] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [billData, setBillData] = useState({
    flatId: '',
    siteId: '',
    serviceId: '',
    stateId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      if (currentBill) {
        // Update existing bill logic here (if necessary)
      } else {
        // Create new bill
        const response = await apiCreateBill(billData);
        dispatch(addBill(response.data));
      }
      setShowModal(false);
      setCurrentBill(null);
      setBillData({ flatId: '', siteId: '', serviceId: '', stateId: '' }); // Reset form
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchPendingBills = async (siteId) => {
    dispatch(setLoading(true));
    try {
      const response = await getPendingBillsBySiteId(siteId);
      dispatch(setBills(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (id) => {
    dispatch(setLoading(true));
    try {
      await apiDeleteBill(id);
      dispatch(removeBill(id));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMarkPaid = async (id) => {
    dispatch(setLoading(true));
    try {
      await markBillAsPaid(id);
      const updatedBill = bills.find(bill => bill.id === id);
      updatedBill.status = 'Paid'; // Update status if necessary
      dispatch(updateBill(updatedBill));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMarkUnpaid = async (id) => {
    dispatch(setLoading(true));
    try {
      await markBillAsUnpaid(id);
      const updatedBill = bills.find(bill => bill.id === id);
      updatedBill.status = 'Unpaid'; // Update status if necessary
      dispatch(updateBill(updatedBill));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchPendingBills(1); // Replace with your site ID
  }, []);

  return (
    <div className="w-full bg-slate-700 pt-20 px-8 mx-auto">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-white text-4xl">Bill Manager</h2>
    <Button variant="primary" className='w-96' onClick={() => setShowModal(true)}>Add New Bill</Button>
  </div>
  {loading && <p className="text-white">Loading...</p>}
  {error && <p className="text-red-500">Error: {error}</p>}
  <Table striped bordered hover className="text-white">
    <thead>
      <tr>
        <th>ID</th>
        <th>Flat ID</th>
        <th>Site ID</th>
        <th>Service ID</th>
        <th>State ID</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(bills) && bills.map((bill) => (
        <tr key={bill.id}>
          <td>{bill.id}</td>
          <td>{bill.flatId}</td>
          <td>{bill.siteId}</td>
          <td>{bill.serviceId}</td>
          <td>{bill.stateId}</td>
          <td>
            <Button variant="success" onClick={() => handleMarkPaid(bill.id)}>Mark Paid</Button>
            <Button variant="warning" onClick={() => handleMarkUnpaid(bill.id)}>Mark Unpaid</Button>
            <Button variant="danger" onClick={() => handleDelete(bill.id)}>Delete</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
  <Modal show={showModal} onHide={() => setShowModal(false)} className="mt-40">
    <Modal.Header closeButton>
      <Modal.Title>Add Bill</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Flat ID:</label>
          <input
            type="number"
            className="form-control"
            value={billData.flatId}
            onChange={(e) => setBillData({ ...billData, flatId: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Site ID:</label>
          <input
            type="number"
            className="form-control"
            value={billData.siteId}
            onChange={(e) => setBillData({ ...billData, siteId: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Service ID:</label>
          <input
            type="number"
            className="form-control"
            value={billData.serviceId}
            onChange={(e) => setBillData({ ...billData, serviceId: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">State ID:</label>
          <input
            type="number"
            className="form-control"
            value={billData.stateId}
            onChange={(e) => setBillData({ ...billData, stateId: e.target.value })}
            required
          />
        </div>
        <Button variant="primary" type="submit">Create</Button>
      </form>
    </Modal.Body>
  </Modal>
</div>

  );
};

export default BillManager;
