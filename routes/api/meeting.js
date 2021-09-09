const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Meeting = require("../../models/Meeting");
const OfficeProfile = require("../../models/OfficeProfile");
const auth = require("../../middleware/auth");
const Office = require("../../models/Office");

//@route    POST api/meeting
//@desc     Create a meeting
//@access   Private
router.post(
  "/",
  [
    auth,
    check("date", "date is required").notEmpty(),
    check("timeStart", "Starting time is required").notEmpty(),
    check("timeEnd", "Ending time is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //TODO: create a route that will view all contactperson and all rooms
    try {
      const office = await Office.findById(req.office.id).select("-password");

      const {
        date,
        timeStart,
        timeEnd,
        room,
        contactPerson,
        specialInstructions,
        isNotPending,
        approvalDate,
        dateCreated,
      } = req.body;

      //TODO: review isNotPending. make this editable
      const newMeeting = new Meeting({
        office: req.office.id,
        date,
        timeStart,
        timeEnd,
        room,
        contactPerson,
        specialInstructions,
        isNotPending,
        approvalDate,
        dateCreated,
      });

      await newMeeting.save();
      res.json(newMeeting);
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

module.exports = router;
