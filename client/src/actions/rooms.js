import axios from "axios";
import { GET_ROOMS, ROOM_ERROR } from "./types";

//Get rooms
export const getRooms = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/rooms/");
    console.log("running");

    dispatch({
      type: GET_ROOMS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
