import axios from "axios";
import { setAlert } from "./alert";
import { GET_ANNOUNCEMENTS, ANNOUNCEMENT_ERROR } from "./types";

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
