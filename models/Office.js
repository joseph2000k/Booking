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
  contactName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  contactEmail: {
    type: String,
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
