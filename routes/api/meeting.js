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
const scheduleVerifier = require("../../middleware/scheduleVerifier");
const moment = require("moment");

//@route    GET api/meeting/
//@desc     Get all past meetings for the current office
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({ office: req.office.id }).sort({
      dateCreated: -1,
    });

    if (meetings.length < 1) {
      return res.status(404).json({ errors: [{ msg: "No meetings found" }] });
    }
    const meeting = meetings.filter(
      (item) => item.office.toString() === req.office.id
    );

    if (!meeting) {
      return res.status(401).json({ errors: [{ msg: "User not Authorized" }] });
    }

    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/meeting/schedules
//@desc Get all schedules for the current office
//@access Private
router.get("/schedules", auth, async (req, res) => {
  try {
    const meetings = await Meeting.aggregate([
      {
        $match: {
          office: ObjectId(req.office.id),
          //isApproved: true,
        },
      },
      { $unwind: "$schedules" },

      {
        $lookup: {
          from: "rooms",
          localField: "schedules.room",
          foreignField: "_id",
          as: "schedules.room",
        },
      },

      {
        $unwind: {
          path: "$schedules.room",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: "$schedules._id",
          meetingId: "$_id",
          isApproved: "$isApproved",
          isCancelled: "$schedules.isCancelled",
          start: "$schedules.start",
          end: "$schedules.end",
          room: "$schedules.room.name",
          description: "$description",
        },
      },
    ]);

    if (meetings.length < 1) {
      return res.status(404).json({ errors: [{ msg: "No schedules found" }] });
    }

    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/meeting/schedules/:id
//@desc    Cancel a schedule
//@access  Private
router.put("/schedule/:meetingId/:id", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    //check user
    if (meeting.office.toString() !== req.office.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }

    //set schedule isCancelled to true
    const schedule = await meeting.schedules.find(
      (item) => item._id == req.params.id
    );

    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found" });
    }

    schedule.isCancelled = true;

    await meeting.save();

    return res.json({ msg: "Schedule cancelled" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  GET api/meeting/meetingdetails/:id
//@desc   Get meeting details
//@access Private
router.get("/:meetingId", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    const office = await Office.findById(req.office.id);

    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    //check user
    if (
      meeting.office.toString() === req.office.id ||
      office.role === "admin"
    ) {
      res.json(meeting);
    } else {
      return res.status(401).json({ msg: "User not Authorized" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/meeting/:meetingId/:id
//@desc   Replace start and end time in meeting schedule
//@access Private

router.put("/reschedule", [auth, scheduleVerifier], async (req, res) => {
  try {
    const { meetingId, scheduleId } = req.body;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    //check user
    if (meeting.office.toString() !== req.office.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }

    //check if meeting is approved
    if (!meeting.isApproved && !meeting.isCancelled) {
      return res.status(401).json({ msg: "Meeting not approved" });
    }

    const schedule = await meeting.schedules.find(
      (item) => item._id.toString() === scheduleId
    );

    if (!schedule) {
      return res.status(404).json({ msg: "Schedule not found" });
    }

    //update room, start and end time using verifiedSchedule
    schedule.start = req.verifiedSchedule.start;
    schedule.end = req.verifiedSchedule.end;
    schedule.room = req.verifiedSchedule.room;

    await meeting.save();

    return res.json({ msg: "Schedule updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/meeting/upcoming
//@desc Get all upcoming schedules for the current office
//@access Private
router.get("/upcoming", auth, async (req, res) => {
  try {
    const meetings = await Meeting.aggregate([
      {
        $match: {
          office: ObjectId(req.office.id),
          isApproved: true,
        },
      },
      { $unwind: "$schedules" },

      {
        $lookup: {
          from: "rooms",
          localField: "schedules.room",
          foreignField: "_id",
          as: "schedules.room",
        },
      },

      {
        $unwind: {
          path: "$schedules.room",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: "$schedules._id",
          start: {
            $cond: {
              if: { $lt: ["$schedules.start", new Date()] },
              then: "$$REMOVE",
              else: "$schedules.start",
            },
          },
          end: "$schedules.end",
          room: "$schedules.room.name",
          description: "$description",
        },
      },
    ]);

    if (meetings.length < 1) {
      return res.status(404).json({ msg: "No meeting found" });
    }

    res.json(meetings);
    /* console.log(meetings);

    if (meetings.length < 1) {
      return res.status(404).json({ msg: "No meeting found" });
    }
    for (let i = 0; i < meetings.length; i++) {
      meetings[i].id = uuidv4();
      var schedules = meetings.filter(
        (item) => item.start.getTime() > Date.now()
      );
    }
    res.json(schedules); */
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
          isCancelled: "$schedules.isCancelled",
          title: "$office.officeName",
          start: "$schedules.start",
          end: "$schedules.end",
          description: 1,
          _id: 0,
        },
      },

      {
        $match: { room: ObjectId(req.params.roomId), isCancelled: false },
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
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting does not exist" });
    }
    if (meeting.isApproved) {
      return res
        .status(406)
        .json({ errors: [{ msg: "Cannot Delete, Meeting already approved" }] });
    }
    if (meeting.office.toString() !== req.office.id) {
      return res.status(401).json({ msg: "User not Authorized" });
    }

    await Meeting.findByIdAndRemove(meeting.id);
    res.json({ msg: "Meeting Deleted" });
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

//@route    GET api/meeting/forapproval/
//@desc     view all meetings that needs to be approve
//@access   Private
router.get("/forapproval/", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      office: req.office.id,
      isApproved: false,
    }).sort({ dateCreated: -1 });

    if (!meetings) {
      return res.status(404).json({ msg: "No meetings found" });
    }
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/meeting/approval/:id
//@desc     approve a meeting
//@access   Private/admin
/* router.put("/approval/:roomId/:meetingId", authAdmin, async (req, res) => {
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
}); */

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

//@route    POST api/submit/
//@desc     Submit meeting
//@access   Private
router.post("/submit/", [auth], async (req, res) => {
  try {
    const {
      description,
      contactName,
      contactNumber,
      numberOfAtendees,
      specialInstructions,
      first,
      second,
      schedules: [start, end, room],
    } = req.body;

    //get schedules in req.body and remove null
    const schedules = req.body.schedules.filter((item) => item !== null);

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
          isCancelled: "$schedules.isCancelled",
          _id: 0,
        },
      },

      {
        $match: { isCancelled: false },
      },
    ]);

    for (let i = 0; i < schedules.length; i++) {
      var scheduleList = allMeeting.find(
        (item) =>
          (item.start.getTime() <= new Date(schedules[i].start).getTime() ||
            item.start.getTime() <= new Date(schedules[i].end).getTime()) &&
          (item.end.getTime() >= new Date(schedules[i].start).getTime() ||
            item.end.getTime() >= new Date(schedules[i].end).getTime()) &&
          item.room.toString() === schedules[i].room.toString()
      );
      if (scheduleList) {
        var scheduleError = {
          msg: `${moment(schedules[i].start).format(
            "MMMM Do YYYY, h:mm:ss "
          )} has already been taken`,
        };
      }
    }

    if (scheduleError) {
      return res.status(409).json({ errors: [scheduleError] });
    }

    const meeting = {
      description,
      contactName,
      contactNumber,
      numberOfAtendees,
      specialInstructions,
      first,
      second,
      schedules,
      office: req.office.id,
      isSubmitted: true,
    };

    const newMeeting = new Meeting(meeting);

    await newMeeting.save();

    res.json(newMeeting);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/checkschedule/
//@desc     check if schedule is available
//@access   Private
router.post("/checkschedule/", [auth, scheduleVerifier], async (req, res) => {
  try {
    res.json(req.verifiedSchedule);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route GET  api/adminforapproval/
//@desc     get all meetings for approval
//@access   Private/admin
router.get("/adminforapproval/", [auth], async (req, res) => {
  try {
    const office = await Office.findById(req.office.id);

    if (office.role !== "admin" && office.role !== "manager") {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const rooms = office.rooms;

    const meetingList = await Meeting.aggregate([
      { $match: { isSubmitted: true, isApproved: false } },
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
          meetingId: "$_id",
          isCancelled: "$schedules.isCancelled",
          title: "$office.officeName",
          contactName: 1,
          dateCreated: 1,
          description: 1,
          _id: 0,
        },
      },
    ]);

    let forApprovals = [];
    for (let i = 0; i < meetingList.length; i++) {
      var room = rooms.find(
        (item) => item.toString() === meetingList[i].room.toString()
      );
      if (
        room &&
        !forApprovals.find(
          (item) =>
            item.meetingId.toString() === meetingList[i].meetingId.toString()
        )
      ) {
        const meeting = {
          meetingId: meetingList[i].meetingId,
          description: meetingList[i].description,
          officeName: meetingList[i].title,
          contactName: meetingList[i].contactName,
          dateCreated: meetingList[i].dateCreated,
        };
        forApprovals.push(meeting);
      }
    }

    res.json(forApprovals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT /approval/:meetingId
//@desc     approve meeting
//@access   Private/admin
router.put("/approval/:meetingId", [auth], async (req, res) => {
  try {
    const office = await Office.findById(req.office.id);

    if (office.role !== "admin" && office.role !== "manager") {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }

    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ errors: [{ msg: "Meeting not found" }] });
    }

    if (meeting.isApproved) {
      return res
        .status(409)
        .json({ errors: [{ msg: "Meeting already approved" }] });
    }

    meeting.isApproved = true;

    await meeting.save();

    res.json("Meeting has been approved");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
