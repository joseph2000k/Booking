import {
  CREATE_MEETING,
  MEETING_ERROR,
  GET_SCHEDULES,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
  GET_MEETINGS,
  MEETING_HISTORY,
  CLEAR_SCHEDULES,
} from '../actions/types';

const initialState = {
  meeting: null,
  meetings: [],
  history: [],
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
    case GET_MEETINGS:
      return {
        ...state,
        meetings: payload,
        loading: false,
      };
    case GET_SCHEDULES:
      return {
        ...state,
        schedules: [payload, ...state.schedules],
        loading: false,
      };
    case MEETING_HISTORY:
      return {
        ...state,
        history: payload,
        loading: false,
      };

    case DELETE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.filter(
          (schedule) => schedule.id !== payload
        ),
      };
    case CLEAR_SCHEDULES:
      return {
        ...state,
        schedules: [],
      };
    case MEETING_ERROR:
    case CLEAR_MEETINGS:
      return {
        ...state,
        history: [],
        meetings: [],
        error: {},
        loading: false,
        schedules: [],
      };
    default:
      return state;
  }
}
