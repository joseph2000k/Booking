import axios from "axios";
import {
  GET_ROOM,
  GET_ROOMS,
  GET_ROOM_MEETINGS,
  ROOM_ERROR,
  ADD_ROOM,
} from "./types";

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

//Get room meetings
export const getRoomMeetings = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/meeting/rooms/${id}`);

    dispatch({
      type: GET_ROOM_MEETINGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get room by ID
export const getRoom = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/rooms/room/${id}`);

    dispatch({
      type: GET_ROOM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add room on creating a meeting
export const addRoom = (id) => async (dispatch) => {
  try {
    dispatch({
      type: ADD_ROOM,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: ROOM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
