//TODO

import axios from 'axios';
import { setAlert } from './alert';
import {
  LOGIN_MEETING_SUCCESS,
  OFFICE_MEETING_LOADED,
  AUTH_MEETING_ERROR,
  LOGIN_MEETING_FAIL,
  REMOVE_MEETING,
} from './types';
import setAuthMeetingToken from '../utils/setAuthMeetingToken';

export const loadCurrentMeeting = () => async (dispatch) => {
  if (localStorage.meetingToken) {
    setAuthMeetingToken(localStorage.meetingToken);
  }

  try {
    const res = await axios.get('/api/authmeeting');

    dispatch({
      type: OFFICE_MEETING_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_MEETING_ERROR,
    });
  }
};

//Login User
export const proceedScheduling = (formData) => async (dispatch) => {
  console.log(formData);
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/authmeeting', formData, config);
    console.log(res.data);

    dispatch({
      type: LOGIN_MEETING_SUCCESS,
      payload: res.data,
    });

    dispatch(loadCurrentMeeting());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_MEETING_FAIL,
    });
  }
};

export const removeTokenMeeting = () => async (dispatch) => {
  dispatch({ type: REMOVE_MEETING });
};
