const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Meeting = require('../../models/Meeting');
const authMeeting = require('../../middleware/authMeeting');
const auth = require('../../middleware/auth');

router.get('/', authMeeting, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.meeting.id);
    res.json(meeting);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    POST api/authmeeting/
//@desc     Authenticate and update meeting
//@access   Private
router.post('/', [auth, authMeeting], async (req, res) => {
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
        config.get('jwtSecretMeeting'),
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
        config.get('jwtSecretMeeting'),
        { expiresIn: 360000 },
        (err, meetingToken) => {
          if (err) throw err;
          res.json({ meetingToken });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
