const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //Get Token from header
  const meetingToken = req.header("x-access-token");
  try {
    if (meetingToken) {
      //Verify token
      const decoded = jwt.verify(meetingToken, config.get("jwtSecretMeeting"));

      req.meeting = decoded.meeting;
      next();
    }

    //Check if not token
    else {
      {
        req.meeting = false;
        next();
      }
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
