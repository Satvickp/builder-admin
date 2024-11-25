// stateMasterActions.js
import { useDispatch } from 'react-redux';
import { setStateMasters, setLoading, setError } from '../redux/Features/stateMasterSlice';
import { getStates } from '../Features/stateapi/stateMasterApi';

export const fetchStateMasters = async () => {
  const dispatch = useDispatch();
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
