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
      adminName: {
        type: Schema.Types.ObjectId,
        ref: "admins",
      },
    },
  ],
});

module.exports = Room = mongoose.model("room", RoomSchema);
