const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Office: {
    type: String,
  },
  contactDetails: {
    type: String,
  },
  level: {
    type: Number,
    required: true,
  },
});

module.exports = Admin = mongoose.model("admin", AdminSchema);
