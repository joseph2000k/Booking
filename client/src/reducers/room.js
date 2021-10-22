import { GET_ROOMS, ROOM_ERROR } from "../actions/types";

const initialState = {
  rooms: [],
  loading: true,
  error: {},
};

export default function roomReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ROOMS:
      return {
        ...state,
        rooms: payload,
        loading: false,
      };

    case ROOM_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
