const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: office,
  },
});

module.exports = Meeting = mongoose.model("meeting", MeetingSchema);
