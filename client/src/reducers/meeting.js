import { CREATE_MEETING, MEETING_ERROR } from "../actions/types";

const initialState = {
  meeting: {},
  loading: true,
  error: {},
};

export default function meetingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_MEETING:
      return {
        ...state,
        meeting: payload,
        loading: false,
      };
    case MEETING_ERROR:
      return {
        ...state,
        error: {},
        loading: false,
        meeting: null,
      };
    default:
      return state;
  }
}
