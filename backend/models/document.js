const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  aadhar: String,
  photo: String,
  marksheet: String,
  incomeCertificate: String,
  domicileCertificate: String
});

module.exports = documentSchema;
