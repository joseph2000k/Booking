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

//@route    GET api/meeting/approval/
//@desc     test route
//@access   Private/admin
router.get('/testroute', async (req, res) => {
  try {
    const d1 = new Date('2023-07-01T12:30:00.000+00:00');
    const meeting = await Schedule.find().populate('meeting');

    /* const approvedMeeting = meeting.filter(
      (item) => item.timeStart.getTime() <= d1.getTime()
    ); */

    const approvedMeeting = meeting.filter(
      (item) => item.meeting.disapproved === true
    );

    /* const pendingMeeting = meeting.filter(
      (item) => item.isNotPending === false && item.disapproved === false
    );
 */
    res.json(approvedMeeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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

    var schedArray = [];
    for (let i = 0; i < getRoom.length; i++) {
      var newRoomsched = {
        meeting: meeting.id,
        room: getRoom[i],
        timeStart: getTimeStart[i],
        timeEnd: getTimeEnd[i],
      };

      let roomId = await Room.findById(getRoom[i]);

      if (!roomId) {
        return res.json({ msg: 'invalid room' });
      }

      if (getTimeStart[i] === getTimeEnd[i]) {
        return res.status(406).json({ msg: 'input date overlapping' });
      }

      if (
        getTimeStart[i + 1] <= getTimeEnd[i] &&
        getTimeStart[i + 1] >= getTimeStart[i]
      ) {
        return res.status(406).json({ msg: 'input date overlapping' });
      }

      if (
        getTimeEnd[i + 1] <= getTimeEnd[i] &&
        getTimeEnd[i + 1] >= getTimeStart[i]
      ) {
        return res.status(406).json({ msg: 'input date overlapping' });
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
          },
        ],
      });

      if (schedule.length > 0) {
        return res.status(406).json({
          msg: `Please check overlapping dates ${timeStart}, ${timeEnd}`,
        });
      }
      var newSched = new Schedule(newRoomsched);
      schedArray.push(newSched);
      meeting.schedules.unshift(newSched.id);
      meeting.requirements.unshift(newRequirements);
    }

    if (schedArray.length === getRoom.length) {
      schedArray.forEach((item) => item.save());

      await meeting.save();
      res.json(meeting);
      schedArray = [];
    } else {
      res.json({ msg: 'invalid inputs' });
      schedArray = [];
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
