import {
  CREATE_MEETING,
  MEETING_ERROR,
  MEETINGS,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
} from '../actions/types';

const initialState = {
  meeting: null,
  schedules: [],
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
        schedules: [payload, ...state.schedules],
        loading: false,
      };
    case DELETE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.filter(
          (schedule) => schedule.id !== payload
        ),
      };
    case MEETING_ERROR:
    case CLEAR_MEETINGS:
      return {
        ...state,
        error: {},
        loading: false,
        schedules: [],
      };
    default:
      return state;
  }
}
