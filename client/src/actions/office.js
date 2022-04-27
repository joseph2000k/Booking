import axios from "axios";
import { setAlert } from "./alert";
import { GET_OFFICE_LIST, ADD_OFFICE } from "./types";

export const getOfficeList = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/offices");

    dispatch({
      type: GET_OFFICE_LIST,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const addOffice = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/api/offices", formData);

    dispatch({
      type: ADD_OFFICE,
      payload: res.data,
    });

    dispatch(setAlert("Office added", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
};
