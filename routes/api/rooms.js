const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authAdmin = require('../../middleware/authAdmin');
const auth = require('../../middleware/auth');
const Admin = require('../../models/Admin');
const OfficeProfile = require('../../models/OfficeProfile');
const Room = require('../../models/Room');

//@route POST api/rooms
//@desc Create a room
//@access Private
router.post(
  '/',
  [authAdmin, check('name', 'room name is required').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, capacity } = req.body;

    try {
      if (req.admin.level !== 1) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      let newRoom = await Room.findOne({ name });

      if (newRoom) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'room already exists' }] });
      }

      newRoom = new Room({
        name,
        location,
        capacity,
      });

      const room = await newRoom.save();

      res.json(room);
    } catch (err) {
      console.err(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  GET api/rooms
//@desc   Get all room
//@access Public
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  GET api/rooms/meetings
//@desc   Get all approved meetings
//@access Private
router.get('/meetings', auth, async (req, res) => {
  try {
    const rooms = await Room.find().populate('meetings', 'rooms');
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//TODO: get next 5 meetings in all rooms

module.exports = router;
