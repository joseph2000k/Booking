const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Meeting = require("../../models/Meeting");
const authMeeting = require("../../middleware/authMeeting");

router.get("/", authMeeting, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.meeting.id);
    res.json(meeting);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
