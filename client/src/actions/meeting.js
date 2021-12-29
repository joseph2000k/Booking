import axios from "axios";
import { setAlert } from "./alert";
import { CREATE_MEETING, MEETING_ERROR, SCHEDULE } from "./types";

//Create a meeting
export const submitMeeting = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const res = await axios.post("/api/meeting/submit", formData, config);

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

//check schedule
export const checkSchedule = (schedule) => async (dispatch) => {
  try {
    const res = await axios.get("/api/meeting/checkSchedule", schedule);

    dispatch({
      type: SCHEDULE,
      payload: res.data,
    });

    dispatch(setAlert("Date is available", "success"));
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
