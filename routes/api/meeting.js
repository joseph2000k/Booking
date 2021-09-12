const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Meeting = require('../../models/Meeting');
const OfficeProfile = require('../../models/OfficeProfile');
const auth = require('../../middleware/auth');
const Office = require('../../models/Office');
const Room = require('../../models/Room');
const authAdmin = require('../../middleware/authAdmin');

//@route    POST api/meeting/schedule
//@desc     Create a meeting
//@access   Private
router.post(
  '/schedule',
  [
    auth,
    check('room').custom((value) => {
      return Room.findById(value).then((room) => {
        if (!room) {
          return Promise.reject('Invalid Room');
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
      const {
        room,
        date,
        timeStart,
        timeEnd,
        first,
        second,
        specialInstructions,
      } = req.body;

      const newRoomsched = {
        room,
        date,
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
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET api/meeting
//@desc     Get meeting for the current office
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const meeting = await Meeting.find({ office: req.office.id });
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    DELETE api/meeting/:meeting_id
//@desc     delete a meeting
//@access   Private
router.delete('/:meeting_id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meeting_id);

    if (!meeting) {
      return res.status(404).json({ msg: 'meeting not found' });
    }

    //check user
    if (meeting.office.toString() !== req.office.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }

    if (meeting.finish) {
      return res
        .status(405)
        .json({ msg: 'cannot be deleted, meeting is finished.' });
    }

    await meeting.remove();
    res.json({ msg: 'meeting removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route    PUT api/meeting/approval/:id
//@desc     approve a meeting
//@access   Private/admin
router.put('/approval/:id', authAdmin, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = { isNotPending: true };

    let meeting = await Meeting.findOneAndUpdate(filter, update, { new: true });
    if (meeting) {
      await meeting.save();
      return res.json(meeting);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
