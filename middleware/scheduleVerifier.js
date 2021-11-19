const Meeting = require("../models/Meeting");
const Room = require("../models/Room");
const mongoose = require("mongoose");

module.exports = async function (req, res, next) {
  const { room, start, end } = req.body;
  let roomName = await Room.findById(room);

  if (!roomName) {
    return res.json({ msg: "invalid room" });
  }

  const meetingList = await Meeting.aggregate([
    { $match: { isSubmitted: true } },
    { $unwind: "$schedules" },
    {
      $lookup: {
        from: "offices",
        localField: "office",
        foreignField: "_id",
        as: "office",
      },
    },

    {
      $unwind: {
        path: "$office",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        room: "$schedules.room",
        title: "$office.officeName",
        start: "$schedules.start",
        end: "$schedules.end",
        _id: 0,
      },
    },
    { $match: { room: mongoose.Types.ObjectId(roomName.id) } },
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
