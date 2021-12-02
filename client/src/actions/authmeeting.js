//TODO

import axios from "axios";
import { setAlert } from "./alert";
import {
  LOGIN_MEETING_SUCCESS,
  OFFICE_MEETING_LOADED,
  OFFICE_MEETINGS_LOADED,
  AUTH_MEETING_ERROR,
  LOGIN_MEETING_FAIL,
  REMOVE_MEETING,
} from "./types";
import setAuthMeetingToken from "../utils/setAuthMeetingToken";

export const loadCurrentMeeting = () => async (dispatch) => {
  if (localStorage.meetingToken) {
    setAuthMeetingToken(localStorage.meetingToken);
  }

  try {
    const res = await axios.get("/api/authmeeting");

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
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/authmeeting", formData, config);

    dispatch({
      type: LOGIN_MEETING_SUCCESS,
      payload: res.data,
    });

    dispatch(loadCurrentMeeting());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_MEETING_FAIL,
    });
  }
};

export const loadOfficeMeetings = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/meeting");

    dispatch({
      type: OFFICE_MEETINGS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_MEETING_ERROR,
    });
  }
};

export const submitMeeting = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios.post("/api/authmeeting/submit", formData, config);

    history.push("/dashboard");
    dispatch(setAlert("Meeting submitted", "success"));
  } catch (err) {
    dispatch({
      type: AUTH_MEETING_ERROR,
    });
  }
};

export const removeTokenMeeting = () => async (dispatch) => {
  dispatch({ type: REMOVE_MEETING });
};
