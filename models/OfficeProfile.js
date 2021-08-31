const mongoose = require('mongoose');

const OfficeProfileSchema = new mongoose.Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'office',
  },
  headofOffice: {
    type: String,
  },
  location: {
    type: String,
  },
  contactPerson: [
    {
      name: {
        type: String,
        required: true,
      },
      contactDetails1: {
        type: String,
      },
      contactDetails2: {
        type: String,
      },
    },
  ],
});

module.exports = OfficeProfile = mongoose.model(
  'officeProfile',
  OfficeProfileSchema
);
