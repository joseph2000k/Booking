import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { setAlert } from './alert';
import {
  CREATE_MEETING,
  MEETING_ERROR,
  GET_MEETING,
  GET_MEETINGS,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
  GET_SCHEDULES,
  GET_TO_SUBMIT_MEETINGS,
  MEETING_HISTORY,
  CLEAR_GET_TO_SUBMIT_MEETINGS,
  GET_FOR_APPROVAL_MEETINGS,
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
    const errors = err.response.data.errors;

    if (errors[0].msg === 'No meetings found') {
      console.log('No meetings found');
      return;
    }

    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get meeting
export const getMeeting = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/meeting/view/${id}`);

    dispatch({
      type: GET_MEETING,
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

//submit meeting for admin
export const submitMeetingAdmin = (meetings, history) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    console.log(meetings);

    const res = await axios.post('/api/meeting/submitadmin', meetings, config);

    dispatch({
      type: CREATE_MEETING,
      payload: res.data,
    });

    history.push('/dashboard');
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

//Get upcoming meetings
export const getSchedules = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/meeting/schedules');

    dispatch({
      type: GET_SCHEDULES,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors[0].msg === 'No schedules found') {
      console.log('No schedules found');
      return;
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
      type: GET_TO_SUBMIT_MEETINGS,
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

//Get for approval meetings (admin)
export const getForApprovalMeetings = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/meeting/adminforApproval');

    dispatch({
      type: GET_FOR_APPROVAL_MEETINGS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

//approve a meeting (admin)
export const approveMeeting = (id) => async (dispatch) => {
  try {
    await axios.put(`/api/meeting/approval/${id}`);

    dispatch(getForApprovalMeetings());

    dispatch(setAlert('Meeting approved', 'success'));
  } catch (err) {
    /* const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
 */
    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//clear meetings
export const clearMeetings = () => ({ type: CLEAR_MEETINGS });

//clear schedules
export const clearSubmitMeetings = () => ({
  type: CLEAR_GET_TO_SUBMIT_MEETINGS,
});

//Reschedule meeting
export const rescheduleMeeting = (meeting) => async (dispatch) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await axios.put('/api/meeting/reschedule', meeting, config);

    dispatch(setAlert('Meeting rescheduled', 'success'));

    dispatch(getSchedules());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

//delete meeting
export const deleteMeeting = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/meeting/${id}`);

    dispatch(setAlert('Meeting deleted', 'success'));

    dispatch(getMeetings());
  } catch (err) {
    const errors = err.response.data.errors;

    dispatch(getMeetings());

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch(getMeetings());
    dispatch(getSchedules());
  }
};

//Cancel a schedule
export const cancelSchedule = (meetingId, id) => async (dispatch) => {
  try {
    await axios.put(`/api/meeting/schedule/${meetingId}/${id}`);

    dispatch(setAlert('Schedule cancelled', 'success'));

    dispatch(getSchedules());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch(getSchedules());
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
