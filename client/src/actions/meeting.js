import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { setAlert } from './alert';
import {
  CREATE_MEETING,
  MEETING_ERROR,
  GET_MEETINGS,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
  GET_SCHEDULES,
  MEETING_HISTORY,
  CLEAR_SCHEDULES,
} from './types';

//Get all meetings for the current office
export const getMeetings = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/meeting');

    dispatch({
      type: GET_MEETINGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Create a meeting
export const submitMeeting = (meetings, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    console.log(meetings);

    const res = await axios.post('/api/meeting/submit', meetings, config);

    dispatch({
      type: CREATE_MEETING,
      payload: res.data,
    });

    history.push('/dashboard');
    dispatch(setAlert('Meeting submitted', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Meeting history
export const meetingHistory = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/meeting');

    dispatch({
      type: MEETING_HISTORY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//check schedule
export const checkSchedule = (schedule) => async (dispatch) => {
  try {
    const id = uuid();
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await axios.post(
      '/api/meeting/checkSchedule',
      schedule,
      config
    );
    console.log(res.data);

    dispatch({
      type: GET_SCHEDULES,
      payload: { ...res.data, id: id },
    });

    dispatch(setAlert('Date is available', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//clear meetings
export const clearMeetings = () => ({ type: CLEAR_MEETINGS });

//clear schedules
export const clearSchedules = () => ({ type: CLEAR_SCHEDULES });

//delete schedule
export const deleteSchedule = (id) => async (dispatch) => {
  try {
    console.log(id);
    dispatch({
      type: DELETE_SCHEDULE,
      payload: id,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
