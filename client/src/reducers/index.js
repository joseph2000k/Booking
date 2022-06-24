import { combineReducers } from "redux";
import room from "./room";
import auth from "./auth";
import alert from "./alert";
import meeting from "./meeting";
import meetingauth from "./meetingauth";
import office from "./office";
import announcements from "./announcements";

export default combineReducers({
  room,
  auth,
  alert,
  meeting,
  meetingauth,
  office,
  announcements,
});
