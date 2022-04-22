const mongoose = require("mongoose");

const OfficeSchema = new mongoose.Schema({
  officeName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Office = mongoose.model("office", OfficeSchema);
