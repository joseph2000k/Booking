import { CREATE_MEETING, MEETING_ERROR, SCHEDULE } from "../actions/types";

const initialState = {
  meeting: {},
  schedule: {},
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
        schedule: {},
        loading: false,
      };
    case SCHEDULE:
      return {
        ...state,
        schedule: payload,
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
