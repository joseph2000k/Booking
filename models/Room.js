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
    type: String,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  ],
});

module.exports = Room = mongoose.model("room", RoomSchema);
