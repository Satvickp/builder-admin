import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStateMasters,
  addStateMaster,
  updateStateMaster,
  setLoading,
  setError,
  selectStateMasters
} from './redux/Features/stateMasterSlice';
import { getStates, createState, updateState, deleteState } from './api/api/stateapi/stateMasterApi';

function States() {
  const dispatch = useDispatch();
  const stateMasters = useSelector(selectStateMasters);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentState, setCurrentState] = useState(null);

  const [newState, setNewState] = useState({
    name: '',
    code: '',
    monthlyChargesType: 0,
    monthlyCharges: '',
    origin: ''
  });

  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setNewState({
      name: '',
      code: '',
      monthlyChargesType: 0,
      monthlyCharges: '',
      origin: ''
    });
  };

  const  handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewState({ ...newState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading('loading'));
    try {
      if (isEdit && currentState && currentState.code) {
        // Ensure currentState exists and has a code before updating
        const updatedState = await updateState(currentState.code, newState);
        dispatch(updateStateMaster(updatedState));
      } else {
        const createdState = await createState(newState);
        dispatch(addStateMaster(createdState));
      }

      handleClose();
      dispatch(setLoading('succeeded'));
    } catch (error) {
      console.error('Error adding/updating state master:', error.message || error);
      dispatch(setError('Failed to add/update state master'));
      dispatch(setLoading('failed'));
    }
  };

  const handleEdit = (stateMaster) => {
    setCurrentState(stateMaster);
    setNewState({stateMaster});
    setIsEdit(true);
    handleShow();
  };

  const handleDelete = async (code) => {
    try {
      await deleteState(code);
      const updatedStateMasters = stateMasters.filter(state => state.code !== code);
      dispatch(setStateMasters(updatedStateMasters));
    } catch (error) {
      console.error('Error deleting state master:', error.message || error);
      dispatch(setError('Failed to delete state master'));
    }
  };

  useEffect(() => {
    const fetchStateMasters = async () => {
      dispatch(setLoading('loading'));
      try {
        const states = await getStates();
        dispatch(setStateMasters(states));
        dispatch(setLoading('succeeded'));
      } catch (error) {
        console.error('Error fetching state masters:', error.message || error);
        dispatch(setError('Failed to fetch state masters'));
        dispatch(setLoading('failed'));
      }
    };

    fetchStateMasters();
  }, [dispatch]);

  return (
    <div className='w-full bg-slate-700 pt-20 px-8 mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div className='w-1/3'>
          <h1 className='text-white ml-4 text-4xl'>States</h1>
        </div>
        <div className='w-96 flex justify-end'>
          <Button variant="primary" className='w-80' onClick={handleShow}>Add New State</Button>
        </div>
      </div>

      <Table striped bordered hover className='w-full'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Monthly Charges Type</th>
            <th>Monthly Charges</th>
            <th>Origin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stateMasters.map((stateMaster) => (
            <tr key={stateMaster.code}>
              <td>{stateMaster.name}</td>
              <td>{stateMaster.code}</td>
              <td>{stateMaster.monthlyChargesType}</td>
              <td>{stateMaster.monthlyCharges}</td>
              <td>{stateMaster.origin}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(stateMaster)}>Edit</Button>{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding or editing a state master */}
      <Modal show={show} onHide={handleClose} className='mt-40'>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit State Master' : 'Add State Master'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" value={newState.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input type="number" className="form-control" name="code" value={newState.code} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Monthly Charges Type</label>
              <input type="number" className="form-control" name="monthlyChargesType" value={newState.monthlyChargesType} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Monthly Charges</label>
              <input type="number" className="form-control" step="0.01" name="monthlyCharges" value={newState.monthlyCharges} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Origin</label>
              <input type="text" className="form-control" name="origin" value={newState.origin} onChange={handleChange} required />
            </div>
            <Button variant="primary" type="submit">{isEdit ? 'Update' : 'Done'}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default States;
