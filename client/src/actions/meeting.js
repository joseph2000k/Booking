import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { setAlert } from './alert';
import {
  CREATE_MEETING,
  MEETING_ERROR,
  MEETINGS,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
} from './types';

//Create a meeting
export const submitMeeting = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const res = await axios.post('/api/meeting/submit', formData, config);

    dispatch({
      type: CREATE_MEETING,
      payload: res.data,
    });

    dispatch(setAlert('Meeting Created', 'success'));
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
      type: MEETINGS,
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
export const clearMeetings = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_MEETINGS,
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
