import {
  CREATE_MEETING,
  MEETING_ERROR,
  MEETINGS,
  CLEAR_MEETINGS,
} from '../actions/types';

const initialState = {
  meeting: null,
  meetings: [],
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
    case MEETINGS:
      return {
        ...state,
        meetings: [payload, ...state.meetings],
        loading: false,
      };
    case MEETING_ERROR:
    case CLEAR_MEETINGS:
      return {
        ...state,
        error: {},
        loading: false,
        meetings: [],
      };
    default:
      return state;
  }
}
