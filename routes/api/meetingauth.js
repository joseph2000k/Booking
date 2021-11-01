const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const Meeting = require('../../models/Meeting');

router.post('/', async (req, res) => {
  const meetingToken = req.header('x-access-token');

  try {
    if (meetingToken) {
      const decoded = jwt.verify(meetingToken, config.get('jwtSecret'));
      req.meeting = decoded.meeting;

      var meetingId = await Meeting.findById(req.meeting.id);
    }

    if (!meetingId || !meetingToken) {
      const payload = {
        meeting: {
          id: new mongoose.mongo.ObjectId(),
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
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
