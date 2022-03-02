const Meeting = require("../models/Meeting");
const Room = require("../models/Room");
const mongoose = require("mongoose");
const moment = require("moment");

module.exports = async function (req, res, next) {
  const { room, start, end } = req.body;
  let roomName = await Room.findById(room);
  console.log(start, end);

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
    //lookup the room
    {
      $lookup: {
        from: "rooms",
        localField: "schedules.room",
        foreignField: "_id",
        as: "room",
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
        room: "$room.admin",
        title: "$office.officeName",
        start: "$schedules.start",
        end: "$schedules.end",
        isCancelled: "$schedules.isCancelled",
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
    admin: roomName.admin,
    roomName: roomName.name,
    start,
    end,
  };
  if (schedule) {
    return res.status(406).json({
      errors: [
        {
          msg: `Please check overlapping dates`,
        },
      ],
    });
  } //if start is past or end is past return error
  if (moment(start).isBefore(moment()) || moment(end).isBefore(moment())) {
    return res.status(403).json({ errors: [{ msg: "invalid time" }] });
  } else {
    req.verifiedSchedule = newSchedule;
    next();
  }
};
