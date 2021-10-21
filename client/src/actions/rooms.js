import axios from 'axios';
import { GET_ROOMS } from './types';

//Get rooms
export const getRooms = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/rooms');

    dispatch({
      type: GET_ROOMS,
      payload: res.data,
    });
  } catch (err) {}
};
