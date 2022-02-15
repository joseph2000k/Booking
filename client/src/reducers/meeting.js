import {
  CREATE_MEETING,
  MEETING_ERROR,
  GET_SCHEDULES,
  GET_TO_SUBMIT_MEETINGS,
  CLEAR_MEETINGS,
  DELETE_SCHEDULE,
  GET_MEETINGS,
  CLEAR_GET_TO_SUBMIT_MEETINGS,
  GET_FOR_APPROVAL_MEETINGS,
} from "../actions/types";

const initialState = {
  meeting: null,
  meetings: [],
  schedules: [],
  //history: [],
  //upcoming: [],
  toSubmit: [],
  forApproval: [],
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
        schedules: payload,
        loading: false,
      };
    case GET_FOR_APPROVAL_MEETINGS:
      return {
        ...state,
        forApproval: payload,
        loading: false,
      };
    case GET_TO_SUBMIT_MEETINGS:
      return {
        ...state,
        toSubmit: [payload, ...state.toSubmit],
        loading: false,
      };
    /*  case MEETING_HISTORY:
      return {
        ...state,
        history: payload,
        loading: false,
      };
    case GET_UPCOMING_MEETINGS:
      return {
        ...state,
        upcoming: payload,
        loading: false,
      }; */

    case DELETE_SCHEDULE:
      return {
        ...state,
        toSubmit: state.toSubmit.filter((schedule) => schedule.id !== payload),
      };

    case CLEAR_GET_TO_SUBMIT_MEETINGS:
      return {
        ...state,
        toSubmit: [],
      };
    case MEETING_ERROR:
    case CLEAR_MEETINGS:
      return {
        ...state,
        history: [],
        meetings: [],
        schedules: [],
        error: {},
        toSubmit: [],
        forApproval: [],
        upcoming: [],
        loading: false,
      };
    default:
      return state;
  }
}
