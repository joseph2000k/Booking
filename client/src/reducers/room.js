import {
  GET_ROOMS,
  GET_ROOM_MEETINGS,
  ROOM_ERROR,
  GET_ROOM,
  ADD_ROOM,
} from "../actions/types";

const initialState = {
  rooms: [],
  room: {},
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

    case GET_ROOM:
      return {
        ...state,
        room: payload,
        loading: false,
      };

    case ADD_ROOM:
      return {
        room: payload,
        loading: false,
      };
    default:
      return state;
  }
}
