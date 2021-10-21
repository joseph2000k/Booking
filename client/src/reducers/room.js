import { GET_ROOMS } from '../actions/types';

const initialState = {
  rooms: [],
  loading: true,
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
  }
}
