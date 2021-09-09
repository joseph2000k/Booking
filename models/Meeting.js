const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'office',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rooms',
  },
  contactPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'officeProfile',
  },
  date: {
    type: Date,
    required: true,
  },
  timeStart: {
    type: Date,
    required: true,
  },
  timeEnd: {
    type: Date,
    required: true,
  },
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

module.exports = Meeting = mongoose.model('meeting', MeetingSchema);
