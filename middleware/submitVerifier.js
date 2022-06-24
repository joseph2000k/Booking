const Meeting = require("../models/Meeting");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const authMeeting = require("../middleware/authMeeting");
/* on submitVerifier middleware

aggregate and match req.meeting.id
project all schedules of the meeting
return all schedules of the given meeting

for each schedules find a date that will match.
if match return a message
if no match proceed to 'next()' 


on authmeeting.js
create a route
find and update isSubmitted: true of the given meeting
  */
module.exports = async function (req, res, next) {
  try {
    var allMeeting = await Meeting.aggregate([
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
      //{ $match: { room: mongoose.Types.ObjectId(roomName.id) } },
      //{ $project: { room: 0 } },
    ]);

    const schedule = await Meeting.findById(req.meeting.id).populate(
      "schedules"
    );
    for (let i = 0; i < schedule.schedules.length; i++) {
      var scheduleList = allMeeting.find(
        (item) =>
          (item.start.getTime() <=
            new Date(schedule.schedules[i].start).getTime() ||
            item.start.getTime() <=
              new Date(schedule.schedules[i].end).getTime()) &&
          (item.end.getTime() >=
            new Date(schedule.schedules[i].start).getTime() ||
            item.end.getTime() >=
              new Date(schedule.schedules[i].end).getTime()) &&
          item.room.toString() === schedule.schedules[i].room.toString()
      );
      if (scheduleList) {
        return res.json({
          msg: `${schedule.schedules[i].start} has already been taken`,
        });
      }
    }

    req.submitSchedule = schedule;
    //console.log(req.submitSchedule);
    next();
    //res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
