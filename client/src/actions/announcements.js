import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_ANNOUNCEMENTS,
  GET_MY_ANNOUNCEMENTS,
  ANNOUNCEMENT_ERROR,
  POST_ANNOUNCEMENT,
} from "./types";

//GET ALL ANNOUNCEMENTS
export const getAnnouncements = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/announcements");
    dispatch({
      type: GET_ANNOUNCEMENTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ANNOUNCEMENT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//GET MY ANNOUNCEMENTS
export const getMyAnnouncements = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/announcements/${id}`);

    dispatch({
      type: GET_MY_ANNOUNCEMENTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ANNOUNCEMENT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.responce.status,
      },
    });
  }
};

//POST ANNOUNCEMENT
export const postAnnouncement = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post("/api/announcements", formData, config);
    dispatch({
      type: POST_ANNOUNCEMENT,
      payload: res.data,
    });
    dispatch(setAlert("Announcement Created", "success"));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: ANNOUNCEMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};