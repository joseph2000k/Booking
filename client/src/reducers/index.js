import { combineReducers } from "redux";
import room from "./room";
import auth from "./auth";
import alert from "./alert";
import meeting from "./meeting";

export default combineReducers({
  room,
  auth,
  alert,
  meeting,
});
