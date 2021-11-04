import axios from "axios";

const setAuthMeetingToken = (meetingToken) => {
  if (meetingToken) {
    axios.defaults.headers.common["x-access-token"] = meetingToken;
  } else {
    delete axios.defaults.headers.common["x-access-token"];
  }
};

export default setAuthMeetingToken;
