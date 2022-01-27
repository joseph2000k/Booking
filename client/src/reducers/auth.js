import {
  LOGIN_SUCCESS,
  OFFICE_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGOUT,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  office: null,
  isSendingRequest: true,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case OFFICE_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        office: payload,
        isSendingRequest: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        isSendingRequest: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        office: null,
        isSendingRequest: false,
      };
    default:
      return state;
  }
}
