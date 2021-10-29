import axios from "axios";
import { setAlert } from "./alert";
import { CREATE_MEETING, MEETING_ERROR } from "./types";

//Create a meeting
export const setMeeting = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const res = await axios.post("/api/meeting/schedule", formData, config);

    dispatch({
      type: CREATE_MEETING,
      payload: res.data,
    });

    dispatch(setAlert("Meeting Created", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: MEETING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
