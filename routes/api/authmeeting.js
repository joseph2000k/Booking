const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Meeting = require("../../models/Meeting");
const authMeeting = require("../../middleware/authMeeting");
const auth = require("../../middleware/auth");
const scheduleVerifier = require("../../middleware/scheduleVerifier");
const submitVerifier = require("../../middleware/submitVerifier");

router.get("/", authMeeting, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.meeting.id);
    res.json(meeting);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/authmeeting/
//@desc     Authenticate and update meeting
//@access   Private
router.post("/", [auth, authMeeting, scheduleVerifier], async (req, res) => {
  try {
    const {
      description,
      contactName,
      contactNumber,
      numberOfAtendees,
      specialInstructions,
      first,
      second,
    } = req.body;

    const meetingFields = {};
    meetingFields.office = req.office.id;
    if (specialInstructions)
      meetingFields.specialInstructions = specialInstructions;

    if (description) meetingFields.description = description;
    if (contactName) meetingFields.contactName = contactName;
    if (contactNumber) meetingFields.contactNumber = contactNumber;
    if (numberOfAtendees) meetingFields.numberOfAtendees = numberOfAtendees;
    if (first) meetingFields.first = first;
    if (second) meetingFields.second = second;

    if (!req.meeting) {
      const meeting = new Meeting(meetingFields);

      meeting.schedules.unshift(req.verifiedSchedule);

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
    } else {
      const meeting = await Meeting.findByIdAndUpdate(
        req.meeting.id,
        {
          $set: meetingFields,
          $push: { schedules: req.verifiedSchedule },
        },
        { multi: true, new: true }
      );

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

//@route    POST api/authmeeting/
//@desc     Submit meeting
//@access   Private
router.post(
  "/submit/",
  [auth, authMeeting, submitVerifier],
  async (req, res) => {
    try {
      //update meetingfields with req.body
      const {
        description,
        contactName,
        contactNumber,
        numberOfAtendees,
        specialInstructions,
        first,
        second,
      } = req.body;

      const meetingFields = {};
      meetingFields.office = req.office.id;
      meetingFields.isSubmitted = true;
      if (specialInstructions)
        meetingFields.specialInstructions = specialInstructions;

      if (description) meetingFields.description = description;
      if (contactName) meetingFields.contactName = contactName;
      if (contactNumber) meetingFields.contactNumber = contactNumber;
      if (numberOfAtendees) meetingFields.numberOfAtendees = numberOfAtendees;
      if (first) meetingFields.first = first;
      if (second) meetingFields.second = second;

      if (req.submitSchedule.office.toString() !== req.office.id) {
        return res.status(400).json({ msg: "Invalid Credentials..." });
      }

      console.log(req.submitSchedule);
      console.log(req.submitSchedule.isSubmitted);

      if (req.submitSchedule.isSubmitted) {
        return res.status(400).json({ msg: "Meeting already submitted..." });
      }

      //find req.submitschdule and update isSubmitted to true
      const submitSchedule = await Meeting.findByIdAndUpdate(
        req.submitSchedule.id,
        {
          $set: meetingFields,
        },
        { new: true }
      );

      res.json(submitSchedule);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
