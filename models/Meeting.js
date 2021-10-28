const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "office",
  },
  schedules: [
    {
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
    },
  ],
  requirements: [
    {
      first: {
        type: String,
      },
      second: {
        type: String,
      },
    },
  ],
  specialInstructions: {
    type: String,
  },
  isNotPending: {
    type: Boolean,
    default: false,
  },
  disapproved: {
    type: Boolean,
    default: false,
  },
  approvalDate: {
    type: Date,
  },
  finish: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Meeting = mongoose.model("meeting", MeetingSchema);
