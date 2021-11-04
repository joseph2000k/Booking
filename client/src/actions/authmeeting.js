//TODO

import axios from "axios";
import { setAlert } from "./alert";
import {
  LOGIN_MEETING_SUCCESS,
  OFFICE_MEETING_LOADED,
  AUTH_MEETING_ERROR,
  LOGIN_MEETING_FAIL,
  REMOVE_MEETING,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

export const loadCurrentMeeting = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthMeetingToken(localStorage.token);
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
export const proceedScheduling =
  (specialInstructions, first, second) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ officeName, password });

    try {
      const res = await axios.post("/api/auth", body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadOffice());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
