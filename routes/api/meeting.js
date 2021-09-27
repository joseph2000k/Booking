const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Meeting = require('../../models/Meeting');
const OfficeProfile = require('../../models/OfficeProfile');
const auth = require('../../middleware/auth');
const Office = require('../../models/Office');
const Room = require('../../models/Room');
const authAdmin = require('../../middleware/authAdmin');
const Schedule = require('../../models/Schedule');

router.post('/schedule', [auth], async (req, res) => {
  try {
    const { room, timeStart, timeEnd, first, second, specialInstructions } =
      req.body;

    const newRequirements = {
      first,
      second,
    };

    const meetingFields = {};
    meetingFields.office = req.office.id;
    if (specialInstructions)
      meetingFields.specialInstructions = specialInstructions;

    let meeting = new Meeting(meetingFields);

    let getRoom = room.split(' ');
    let getTimeStart = timeStart.split(' ');
    let getTimeEnd = timeEnd.split(' ');

    for (let i = 0; i < getRoom.length; i++) {
      var newRoomsched = {
        meeting: meeting.id,
        room: getRoom[i],
        timeStart: getTimeStart[i],
        timeEnd: getTimeEnd[i],
      };

      console.log(getTimeEnd[i]);

      let roomId = await Room.findById(getRoom[i]);

      if (!roomId) {
        return res.json({ msg: 'invalid room' });
      }
      const schedule = await Schedule.find({
        $and: [
          {
            $and: [
              {
                $or: [
                  { timeStart: { $lte: getTimeStart[i] } },
                  { timeStart: { $lte: getTimeEnd[i] } },
                ],
              },
              {
                $or: [
                  { timeEnd: { $gte: getTimeStart[i] } },
                  { timeEnd: { $gte: getTimeEnd[i] } },
                ],
              },
            ],

            disapproved: false,
          },
        ],
      }).populate({ path: 'meeting', match: { disapproved: false } });

      console.log(schedule);
      if (schedule.length > 0) {
        return res.status(406).json({
          msg: `Dates are already reserved with date(s), ${getTimeStart[i]}, ${getTimeEnd[i]}`,
        });
      }
      let newSched = new Schedule(newRoomsched);
      await newSched.save();
      meeting.schedules.unshift(newSched.id);
    }

    meeting.requirements.unshift(newRequirements);

    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
