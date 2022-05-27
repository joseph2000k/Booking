const Meeting = require("../models/Meeting");
const Room = require("../models/Room");
const mongoose = require("mongoose");
const moment = require("moment");

module.exports = async function (req, res, next) {
  const { room, start, end, scheduleId } = req.body;
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
      $unwind: {
        path: "$room",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        room: "$room._id",
        title: "$office.officeName",
        start: "$schedules.start",
        end: "$schedules.end",
        isCancelled: "$schedules.isCancelled",
        scheduleId: "$schedules._id",
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

  meetingArray = [];
  for (let i = 0; i < meetingList.length; i++) {
    if (
      (moment(start).isBefore(meetingList[i].start) &&
        moment(end).isAfter(meetingList[i].end)) ||
      (moment(start).isSameOrAfter(meetingList[i].start) &&
        moment(end).isSameOrBefore(meetingList[i].end))
    ) {
      meetingArray.push(meetingList[i]);
    }
    if (start === undefined) {
      continue;
    }
  }

  console.log(meetingArray);
  if (meetingArray.length > 1) {
    return res.json({ msg: "Please check date" });
  } else if (meetingArray.length == 1 && meetingArray.start != undefined) {
    console.log(meetingArray[0], "this is the meeting array");
    if (meetingArray[0].scheduleId == scheduleId) {
      return next();
    } else if (meetingArray[0].scheduleId != scheduleId) {
      return res.json({ msg: "Please check date" });
    }
  }

  if (meetingArray.length == 0 || meetingArray[0].scheduleId != scheduleId) {
    const schedule = meetingList.find(
      (item) =>
        (item.start.getTime() <= new Date(start).getTime() ||
          item.start.getTime() <= new Date(end).getTime()) &&
        (item.end.getTime() >= new Date(start).getTime() ||
          item.end.getTime() >= new Date(end).getTime())
    );
    if (schedule) {
      return res.status(406).json({
        errors: [
          {
            msg: `Please check overlapping dates`,
          },
        ],
      });
    }
  }

  const newSchedule = {
    room: roomName.id,
    admin: roomName.admin,
    roomName: roomName.name,
    start,
    end,
  };

  //if start is past or end is past return error
  if (moment(start).isBefore(moment()) || moment(end).isBefore(moment())) {
    return res.status(403).json({ errors: [{ msg: "invalid time" }] });
  } else {
    req.verifiedSchedule = newSchedule;
    next();
  }
};
