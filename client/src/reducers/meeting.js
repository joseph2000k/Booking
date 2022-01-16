import {
  CREATE_MEETING,
  MEETING_ERROR,
  MEETINGS,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
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
        meeting: null,
        schedule: {},
        loading: false,
      };
    case MEETINGS:
      return {
        ...state,
        meetings: [payload, ...state.meetings],
        loading: false,
      };
    case DELETE_SCHEDULE:
      return {
        ...state,
        meetings: state.meetings.filter((meeting) => meeting.id !== payload),
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
