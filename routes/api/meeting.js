const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Meeting = require("../../models/Meeting");
const OfficeProfile = require("../../models/OfficeProfile");
const auth = require("../../middleware/auth");
const Office = require("../../models/Office");
const Room = require("../../models/Room");
const authAdmin = require("../../middleware/authAdmin");

//@route    POST api/meeting/schedule
//@desc     Meeting test route, delete this.
//@access   Private
router.post("/testmeeting", async (req, res) => {
  try {
    const allrooms = await Meeting.find().populate("rooms");
    const room = allrooms.map((item) => item.rooms);
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/meeting/schedule
//@desc     Room test route, delete this.
//@access   Private
router.post("/test", async (req, res) => {
  try {
    const rooms = await Room.find().populate("meetings", "rooms");
    const room = rooms.map((item) => item.meetings);
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/meeting/schedule
//@desc     Create a meeting
//@access   Private
router.post(
  "/schedule",
  [
    auth,
    check("room").custom((value) => {
      return Room.findById(value).then((room) => {
        if (!room) {
          return Promise.reject("Invalid Room");
        }
      });
    }),
    //check('timeStart', 'Starting time is required').notEmpty(),
    //check('timeEnd', 'Ending time is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { room, timeStart, timeEnd, first, second, specialInstructions } =
        req.body;

      const newRoomsched = {
        room,
        timeStart,
        timeEnd,
      };

      const newRequirements = {
        first,
        second,
      };

      const meetingFields = {};
      meetingFields.office = req.office.id;
      if (specialInstructions)
        meetingFields.specialInstructions = specialInstructions;

      let meeting = new Meeting(meetingFields);
      meeting.rooms.unshift(newRoomsched);
      meeting.requirements.unshift(newRequirements);

      await meeting.save();
      res.json(meeting);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/meeting/schedule/:id
//@desc     Add schedule in a meeting
//@access   Private
router.put(
  "/schedule/:id",
  auth,
  check("room").custom((value) => {
    return Room.findById(value).then((room) => {
      if (!room) {
        return Promise.reject("Invalid Room");
      }
    });
  }),
  async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id);

      if (meeting.isNotPending || meeting.finish) {
        return res.status(404).json("this meeting has already been approved");
      }

      //check user
      if (meeting.office.toString() !== req.office.id) {
        return res.status(401).json("User not authorized");
      }

      const { room, timeStart, timeEnd } = req.body;

      const newRoomsched = {
        room,
        timeStart,
        timeEnd,
      };

      meeting.rooms.unshift(newRoomsched);
      await meeting.save();
      res.json(meeting);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/meeting
//@desc     Get meeting for the current office
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const meeting = await Meeting.find({ office: req.office.id });
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/meeting/:meeting_id
//@desc     delete a meeting
//@access   Private
router.delete("/:meeting_id", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meeting_id);

    if (!meeting) {
      return res.status(404).json({ msg: "meeting not found" });
    }

    //check user
    if (meeting.office.toString() !== req.office.id) {
      return res.status(401).json({ msg: "user not authorized" });
    }

    if (meeting.finish) {
      return res
        .status(405)
        .json({ msg: "cannot be deleted, meeting is finished." });
    }

    await meeting.remove();
    res.json({ msg: "meeting removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/meeting/approval/:id
//@desc     approve a meeting
//@access   Private/admin
router.put("/approval/:id", authAdmin, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = { isNotPending: true };

    let updatedMeeting = await Meeting.findOneAndUpdate(filter, update, {
      new: true,
    });

    //look for all the rooms in meeting.rooms
    const meetingRoom = updatedMeeting.rooms.map((item) => item.room);
    let room = await Room.findById(meetingRoom);

    if (updatedMeeting && room) {
      room.meetings.unshift(updatedMeeting);
      await updatedMeeting.save();
      await room.save();
      return res.json(updatedMeeting);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    GET api/meeting/approval/
//@desc     show all meetings that needs to be approve
//@access   Private/admin
router.get("/approval", authAdmin, async (req, res) => {
  try {
    const meeting = await Meeting.find();

    const pendingMeeting = meeting.filter(
      (item) => item.isNotPending === false
    );

    res.json(pendingMeeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
