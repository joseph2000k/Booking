const mongoose = require('mongoose');

const OfficeSchema = new mongoose.Schema({
  officeName: {
    type: String,
    required: true,
  },
  contactPerson: [
    {
      name: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
      },
    },
  ],
  room: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = Office = mongoose.model('office', OfficeSchema);
