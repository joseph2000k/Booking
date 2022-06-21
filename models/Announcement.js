const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  office: {
    type: Schema.Types.ObjectId,
    ref: "Office",
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Announcements = mongoose.model(
  "Announcement",
  AnnouncementSchema
);
