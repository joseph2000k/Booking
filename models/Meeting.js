const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "office",
  },
  description: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  numberOfAttendees: {
    type: Number,
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
      isCancelled: {
        type: Boolean,
        default: false,
      },
    },
  ],
  firstRequirements: {
    type: String,
  },
  secondRequirements: {
    type: String,
  },
  specialInstructions: {
    type: String,
  },
  isNotPending: {
    type: Boolean,
    default: false,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  isApproved: {
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
