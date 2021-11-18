const Meeting = require("../../models/Meeting");
const mongoose = require("mongoose");
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
module.exports = async function (req, res, next) {};
try {
  const schedule = await Meeting.findById(req.meeting.id).populate(schedules);
} catch (err) {
  console.error(err.message);
  res.status(500).send("Server Error");
}
