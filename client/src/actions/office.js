import axios from "axios";
import { GET_OFFICE_LIST } from "./types";

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
