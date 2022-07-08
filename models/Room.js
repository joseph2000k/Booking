const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "office",
  },
});

module.exports = Room = mongoose.model("room", RoomSchema);
