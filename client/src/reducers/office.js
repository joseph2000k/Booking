import { GET_OFFICE_LIST, ADD_OFFICE, DELETE_OFFICE } from "../actions/types";

const initialState = {
  officeList: [],
  loading: true,
  error: {},
};

export default function officeReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_OFFICE_LIST:
      return {
        ...state,
        officeList: payload,
        loading: false,
      };

    case ADD_OFFICE:
      return {
        ...state,
        officeList: [...payload],
        loading: false,
      };

    case DELETE_OFFICE:
      return {
        ...state,
        officeList: state.officeList.filter((office) => office._id !== payload),
        loading: false,
      };

    default:
      return state;
  }
}
