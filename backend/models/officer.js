// models/Officer.js
const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Officer', officerSchema);
