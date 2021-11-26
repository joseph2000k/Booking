const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Meeting = require("../../models/Meeting");
const OfficeProfile = require("../../models/OfficeProfile");
const auth = require("../../middleware/auth");
const Office = require("../../models/Office");
const Room = require("../../models/Room");
const authAdmin = require("../../middleware/authAdmin");
const authMeeting = require("../../middleware/authMeeting");
const Schedule = require("../../models/Schedule");
var ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const moment = require("moment");

//@route    GET api/meeting/
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

//@route    GET api/meeting/office/:meetingId
//@desc     get meeting by Id
//@access   Private
router.get("/office/:meetingId", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@route    GET api/meeting/rooms/:roomId
//@desc     view all meetings in a room
//@access   Public
router.get("/rooms/:roomId", async (req, res) => {
  try {
    const meetingList = await Meeting.aggregate([
      { $match: { isSubmitted: true } },
      { $unwind: "$schedules" },
      {
        $lookup: {
          from: "offices",
          localField: "office",
          foreignField: "_id",
          as: "office",
        },
      },

      {
        $unwind: {
          path: "$office",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          isApproved: 1,
          room: "$schedules.room",
          title: "$office.officeName",
          start: "$schedules.start",
          end: "$schedules.end",
          description: 1,
          _id: 0,
        },
      },

      {
        $match: { room: ObjectId(req.params.roomId) },
      },
    ]);

    const meetings = meetingList.map((item) => {
      if (item.isApproved === false) {
        item.title = "Waiting for Approval";
        item.description = "Reserved (Waiting for Approval)";
      } else {
        item.description +=
          " on " +
          moment(item.start).format("MMMM DD YYYY , [From] h:mm a") +
          " - " +
          moment(item.end).format("h:mm a");
      }
      return item;
    });

    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/meeting/schedule/
//@desc     Schedule a meeting
//@access   Private
router.post("/schedule", [auth, authMeeting], async (req, res) => {
  try {
    const { specialInstructions, first, second } = req.body;

    const newRequirements = {
      first,
      second,
    };

    const meetingFields = {};
    meetingFields.office = req.office.id;
    if (specialInstructions)
      meetingFields.specialInstructions = specialInstructions;

    if (req.meeting === null) {
      const meeting = new Meeting(meetingFields);

      meeting.requirements.unshift(newRequirements);

      payload = {
        meeting: {
          id: meeting.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecretMeeting"),
        { expiresIn: 360000 },
        (err, meetingToken) => {
          if (err) throw err;
          res.json({ meetingToken });
        }
      );

      await meeting.save();
      console.log(meeting);
    } else {
      const meeting = await Meeting.findByIdAndUpdate(
        req.meeting.id,
        { $set: meetingFields, $push: { requirements: newRequirements } },
        { multi: true, new: true }
      );

      console.log(meeting.id);

      await meeting.save();

      payload = {
        meeting: {
          id: meeting.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecretMeeting"),
        { expiresIn: 360000 },
        (err, meetingToken) => {
          if (err) throw err;
          res.json({ meetingToken });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route    PUT
//@desc     add schedule to the meeting
//@access   Private
router.put("/schedule/:meetingId", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      console.log("meeting not found");
    }
    const { room, start, end } = req.body;
    let roomName = await Room.findOne({ name: room });

    if (!roomName) {
      return res.json({ msg: "invalid room" });
    }

    const meetingList = await Meeting.aggregate([
      { $unwind: "$schedules" },
      {
        $lookup: {
          from: "offices",
          localField: "office",
          foreignField: "_id",
          as: "office",
        },
      },

      {
        $unwind: {
          path: "$office",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          room: "$schedules.room",
          title: "$office.officeName",
          start: "$schedules.start",
          end: "$schedules.end",
          _id: 0,
        },
      },

      { $project: { room: 0 } },
    ]);

    const schedule = meetingList.find(
      (item) =>
        (item.start.getTime() <= new Date(start).getTime() ||
          item.start.getTime() <= new Date(end).getTime()) &&
        (item.end.getTime() >= new Date(start).getTime() ||
          item.end.getTime() >= new Date(end).getTime())
    );

    const newSchedule = {
      room: roomName.id,
      start,
      end,
    };
    console.log(schedule);
    if (schedule) {
      return res.status(406).json({
        msg: `Please check overlapping dates`,
      });
    } else {
      meeting.schedules.unshift(newSchedule);
    }
    meeting.save();
    res.json(meeting);
  } catch (error) {}
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
        item.meeting.isNotPending === false && item.meeting.isApproved === false
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

//@route    PUT api/meeting/approval/:id
//@desc     TEST ROUTE approve a meeting
//@access   Private/admin
router.post("/testroute", async (req, res) => {
  try {
    var allMeeting = await Meeting.aggregate([
      { $match: { isSubmitted: true } },
      { $unwind: "$schedules" },
      {
        $lookup: {
          from: "offices",
          localField: "office",
          foreignField: "_id",
          as: "office",
        },
      },

      {
        $unwind: {
          path: "$office",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          room: "$schedules.room",
          title: "$office.officeName",
          start: "$schedules.start",
          end: "$schedules.end",
          _id: 0,
        },
      },
      //{ $match: { room: mongoose.Types.ObjectId(roomName.id) } },
      //{ $project: { room: 0 } },
    ]);

    const schedule = await Meeting.findById(req.body.meetingId).populate(
      "schedules"
    );
    for (let i = 0; i < schedule.schedules.length; i++) {
      var scheduleList = allMeeting.find(
        (item) =>
          (item.start.getTime() <=
            new Date(schedule.schedules[i].start).getTime() ||
            item.start.getTime() <=
              new Date(schedule.schedules[i].end).getTime()) &&
          (item.end.getTime() >=
            new Date(schedule.schedules[i].start).getTime() ||
            item.end.getTime() >=
              new Date(schedule.schedules[i].end).getTime()) &&
          item.room.toString() === schedule.schedules[i].room.toString()
      );
      if (scheduleList) {
        return res.json({
          msg: `${schedule.schedules[i].start} has already been taken`,
        });
      }
    }

    res.status(200).json({ msg: "Meeting is available" });
    //res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
