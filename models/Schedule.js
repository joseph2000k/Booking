const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "meeting",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

module.exports = Schedule = mongoose.model("schedule", ScheduleSchema);
