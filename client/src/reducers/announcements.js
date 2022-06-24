import { GET_ANNOUNCEMENTS, ANNOUNCEMENT_ERROR } from "../actions/types";

const initialState = {
  announcements: [],
  loading: true,
  error: {},
};

export default function announcementsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: payload,
        loading: false,
      };

    case ANNOUNCEMENT_ERROR:
      return {
        ...state,
        announcements: [],
        loading: false,
      };

    default:
      return state;
  }
}
