import { GET_ROOMS, GET_ROOM_MEETINGS, ROOM_ERROR } from "../actions/types";

const initialState = {
  rooms: [],
  meetings: [],
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

    case GET_ROOM_MEETINGS:
      return {
        ...state,
        meetings: payload,
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
