import {
  LOGIN_SUCCESS,
  OFFICE_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  office: null,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case OFFICE_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        office: payload,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        office: null,
        loading: false,
      };
    default:
      return state;
  }
}
