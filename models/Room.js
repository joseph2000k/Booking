const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  capacity: {
    type: String,
  },
  meetings: [
    {
      meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'meeting',
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
    },
  ],
  admins: [
    {
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
      },
      name: {
        type: String,
      },
      office: {
        type: String,
      },
      contactDetails: {
        type: String,
      },
      level: {
        type: Number,
      },
    },
  ],
});

module.exports = Room = mongoose.model('room', RoomSchema);
