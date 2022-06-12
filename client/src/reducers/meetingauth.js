import {
  LOGIN_MEETING_SUCCESS,
  OFFICE_MEETING_LOADED,
  OFFICE_MEETINGS_LOADED,
  AUTH_MEETING_ERROR,
  LOGIN_MEETING_FAIL,
  REMOVE_MEETING,
} from "../actions/types";
import axios from "axios";

const initialState = {
  meetingToken: localStorage.getItem("meetingToken"),
  isAuthenticated: null,
  loading: true,
  meeting: {},
  meetings: [],
};

export default function authmeetingReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case OFFICE_MEETING_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        meeting: payload,
      };
    case OFFICE_MEETINGS_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        meeting: {},
        meetings: payload,
      };
    case LOGIN_MEETING_SUCCESS:
      localStorage.setItem("meetingToken", payload.meetingToken);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_MEETING_ERROR:
    case LOGIN_MEETING_FAIL:
    case REMOVE_MEETING:
      localStorage.removeItem("meetingToken");
      delete axios.defaults.headers.common["x-access-token"];
      return {
        ...state,
        meetingToken: null,
        isAuthenticated: false,
        meeting: {},
        loading: false,
      };
    default:
      return state;
  }
}
