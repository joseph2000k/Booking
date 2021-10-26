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
var ObjectId = require("mongodb").ObjectID;

//@route    GET api/meeting/approval/
//@desc     Get all meetings for the current office
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ office: req.office.id });

    if (meetings.length < 1) {
      return res.status(404).json({ msg: "No meeting found" });
    }
    const meeting = meetings.filter(
      (item) => item.office.toString() === req.office.id
    );

    if (!meeting) {
      return res.status(401).json({ msg: "User not Authorized" });
    }

    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/meeting/approval/
//@desc     view all meetings in a room
//@access   Public
router.get("/rooms/:roomId", async (req, res) => {
  try {
    const meetingList = await Schedule.aggregate([
      { $match: { room: new ObjectId(req.params.roomId) } },

      {
        $lookup: {
          from: "meetings",
          localField: "meeting",
          foreignField: "_id",
          as: "title",
        },
      },
      {
        $unwind: {
          path: "$title",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "offices",
          localField: "title.office",
          foreignField: "_id",
          as: "titles",
        },
      },
      {
        $unwind: {
          path: "$titles",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: { start: 1, end: 1, title: "$titles.officeName" },
      },
    ]);

    res.json(meetingList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/meeting/approval/
//@desc     Schedule a meeting
//@access   Private
router.post("/schedule", [auth], async (req, res) => {
  try {
    const { room, start, end, first, second, specialInstructions } = req.body;

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
    let getTimeStart = start.split(" ");
    let getTimeEnd = end.split(" ");

    var schedArray = [];
    for (let i = 0; i < getRoom.length; i++) {
      var newRoomsched = {
        meeting: meeting.id,
        room: getRoom[i].trim(),
        start: getTimeStart[i].trim(),
        end: getTimeEnd[i].trim(),
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
          (item.start.getTime() <= new Date(getTimeStart[i]).getTime() ||
            item.start.getTime() <= new Date(getTimeEnd[i]).getTime()) &&
          (item.end.getTime() >= new Date(getTimeStart[i]).getTime() ||
            item.end.getTime() >= new Date(getTimeEnd[i]).getTime()) &&
          item.meeting.disapproved === false
      );

      if (schedule.length > 0) {
        return res.status(406).json({
          msg: `Please check overlapping dates ${start}, ${end}`,
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
//@desc     delete a meeting test route
//@access   Private/admin
router.delete("/:meetingId", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    const schedule = await Schedule.find({ meeting: req.params.meetingId });
    if (!meeting || !schedule) {
      return res.status(404).json({ msg: "Meeting does not exist" });
    }
    if (meeting.office.toString() !== req.office.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }

    if (meeting && schedule.length > 0) {
      await Schedule.deleteMany({ meeting: req.params.meetingId });
      await meeting.remove();
      return res.status(200).json({ msg: "Meeting Deleted" });
    } else {
      return res.json({ msg: "Deleting a meeting failed" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/meeting/approval/
//@desc     view all meetings that needs to be approve
//@access   Private/admin
//TODO  VERIFY ADMIN BEFORE APPROVAL
router.get("/approval/:roomId", authAdmin, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    const admin = room.admins.includes(req.admin.id);
    if (!admin) {
      return res.status(410).json("Not Authorized");
    }

    const meetings = await Schedule.find({ room: req.params.roomId }).populate(
      "meeting"
    );

    const pendingMeeting = meetings.filter(
      (item) =>
        item.meeting.isNotPending === false &&
        item.meeting.disapproved === false
    );

    res.json(pendingMeeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/meeting/approval/:id
//@desc     approve a meeting
//@access   Private/admin
router.put("/approval/:roomId/:meetingId", authAdmin, async (req, res) => {
  try {
    //Check user
    const roomCheck = await Room.findById(req.params.roomId);
    const admin = roomCheck.admins.includes(req.admin.id);
    if (!admin) {
      return res.status(410).json("Not Authorized");
    }

    const meetings = await Schedule.find({ room: req.params.roomId }).populate(
      "meeting"
    );

    //Pull out meeting that needs approval
    const meetingToBeApproved = meetings.find(
      (item) => item.meeting.id === req.params.meetingId
    );

    //Make sure meeting exists
    if (!meetingToBeApproved) {
      return res.status(404).json({ msg: "Meeting does not exist" });
    }

    const filter = { _id: req.params.meetingId };
    const update = { isNotPending: true };

    const schedule = await Meeting.findById(req.params.meetingId);

    if (schedule.isNotPending || schedule.finish) {
      return res
        .status(404)
        .json({ msg: "meeting has already been approved or done" });
    }
    let updatedMeeting = await Meeting.findOneAndUpdate(filter, update, {
      new: true,
    });

    await updatedMeeting.save();
    return res.json(updatedMeeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
