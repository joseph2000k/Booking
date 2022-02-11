const Meeting = require('../models/Meeting');
const Room = require('../models/Room');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = async function (req, res, next) {
  const { room, start, end } = req.body;
  let roomName = await Room.findById(room);
  console.log(start, end);

  if (!roomName) {
    return res.json({ msg: 'invalid room' });
  }

  //if start is past or end is past return error
  if (moment(start) < moment() || moment(end) < moment()) {
    return res.status(403).json({ errors: [{ msg: 'invalid time' }] });
  }

  const meetingList = await Meeting.aggregate([
    { $match: { isSubmitted: true } },
    { $unwind: '$schedules' },
    {
      $lookup: {
        from: 'offices',
        localField: 'office',
        foreignField: '_id',
        as: 'office',
      },
    },

    {
      $unwind: {
        path: '$office',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        room: '$schedules.room',
        title: '$office.officeName',
        start: '$schedules.start',
        end: '$schedules.end',
        isCancelled: '$schedules.isCancelled',
        _id: 0,
      },
    },
    {
      $match: {
        room: mongoose.Types.ObjectId(roomName.id),
        isCancelled: false,
      },
    },
    { $project: { room: 0 } },
  ]);

  const schedule = meetingList.find(
    (item) =>
      (item.start.getTime() <= new Date(start).getTime() ||
        item.start.getTime() <= new Date(end).getTime()) &&
      (item.end.getTime() >= new Date(start).getTime() ||
        item.end.getTime() >= new Date(end).getTime())
  );

  const newSchedule = {
    room: roomName.id,
    roomName: roomName.name,
    start,
    end,
  };
  if (schedule) {
    return res.status(406).json({
      msg: `Please check overlapping dates`,
    });
  } else {
    req.verifiedSchedule = newSchedule;
    next();
  }
};
