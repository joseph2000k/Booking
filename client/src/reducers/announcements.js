import {
  GET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  ANNOUNCEMENT_ERROR,
  GET_MY_ANNOUNCEMENTS,
} from "../actions/types";

const initialState = {
  announcements: [],
  myannouncements: [],
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

    case GET_MY_ANNOUNCEMENTS:
      return {
        ...state,
        myannouncements: payload,
        loading: false,
      };

    case POST_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [payload, ...state.announcements],
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
