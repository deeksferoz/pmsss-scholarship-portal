const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: {               // 👈 Add this field
    type: Number,
    required: false
  },
  fullName: String,
  dateOfBirth: String,
  gender: String,
  email: String,
  mobileNumber: String,
  aadharNumber: String,
  residentialAddress: String,
  city: String,
  state: String,
  pinCode: String,
  alternateContact: String,
  schoolName: String,
  boardName: String,
  courseName: String,
  courseDuration: String,
  yearOfAdmission: String,
  currentYear: String,
  rollNumber: String,
  previousYearMarks: String,
  category: String,
  annualIncome: String,
  incomeCertificateNumber: String,
  domicileCertificateNumber: String,
  previousAvailed: Boolean
});

module.exports = mongoose.model('Registration', registrationSchema);
