const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Meeting = require("../../models/Meeting");
const OfficeProfile = require("../../models/OfficeProfile");
const auth = require("../../middleware/auth");
const Office = require("../../models/Office");
const Room = require("../../models/Room");
const authAdmin = require("../../middleware/authAdmin");
const Schedule = require("../../models/Schedule");

//@route    GET api/meeting/approval/
//@desc     test route for finding all scheds in a room
//@access   Private/admin
router.get("/testroute", async (req, res) => {
  try {
    const distinctRoom = await Schedule.find().distinct("room");
    roomArray = [];
    distinctRoom.forEach((item) => roomArray.push(item));
    for (let i = 0; i < roomArray.length; i++) {
      var roomStr = roomArray[i].toString();
    }
    console.log(roomArray);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/schedule", [auth], async (req, res) => {
  try {
    const { room, timeStart, timeEnd, first, second, specialInstructions } =
      req.body;

    const newRequirements = {
      first,
      second,
    };

    const meetingFields = {};
    meetingFields.office = req.office.id;
    if (specialInstructions)
      meetingFields.specialInstructions = specialInstructions;

    let meeting = new Meeting(meetingFields);

    let getRoom = room.split(" ");
    let getTimeStart = timeStart.split(" ");
    let getTimeEnd = timeEnd.split(" ");

    console.log(getRoom);
    var schedArray = [];
    for (let i = 0; i < getRoom.length; i++) {
      var newRoomsched = {
        meeting: meeting.id,
        room: getRoom[i].trim(),
        timeStart: getTimeStart[i].trim(),
        timeEnd: getTimeEnd[i].trim(),
      };

      let roomId = await Room.findById(getRoom[i]);

      if (!roomId) {
        return res.json({ msg: "invalid room" });
      }

      if (getTimeStart[i] === getTimeEnd[i]) {
        return res.status(406).json({ msg: "input date overlapping" });
      }

      if (
        getTimeStart[i + 1] <= getTimeEnd[i] &&
        getTimeStart[i + 1] >= getTimeStart[i]
      ) {
        return res.status(406).json({ msg: "input date overlapping" });
      }

      if (
        getTimeEnd[i + 1] <= getTimeEnd[i] &&
        getTimeEnd[i + 1] >= getTimeStart[i]
      ) {
        return res.status(406).json({ msg: "input date overlapping" });
      }

      const meetings = await Schedule.find().populate("meeting");

      const schedule = meetings.filter(
        (item) =>
          (item.timeStart.getTime() <= new Date(getTimeStart[i]).getTime() ||
            item.timeStart.getTime() <= new Date(getTimeEnd[i]).getTime()) &&
          (item.timeEnd.getTime() >= new Date(getTimeStart[i]).getTime() ||
            item.timeEnd.getTime() >= new Date(getTimeEnd[i]).getTime()) &&
          item.meeting.disapproved === false
      );

      if (schedule.length > 0) {
        return res.status(406).json({
          msg: `Please check overlapping dates ${timeStart}, ${timeEnd}`,
        });
      }
      var newSched = new Schedule(newRoomsched);
      schedArray.push(newSched);
      meeting.schedules.unshift(newSched.id);
    }

    meeting.requirements.unshift(newRequirements);
    if (
      schedArray.length === getRoom.length &&
      schedArray.length === getTimeStart.length &&
      schedArray.length === getTimeEnd.length
    ) {
      schedArray.forEach((item) => item.save());

      await meeting.save();
      res.json(meeting);
      schedArray = [];
    } else {
      res.json({ msg: "invalid inputs" });
      schedArray = [];
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/meeting/approval/
//@desc     test route
//@access   Private/admin
router.delete("/testroute2", async (req, res) => {
  try {
    await Room.deleteMany({
      _id: "6133b21735ea3a22af9fd1e0",
      meetings: "6133b21735ea3a22af9fd1e0",
    });
    // Number of docs deleted
    res.deletedCount;
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
