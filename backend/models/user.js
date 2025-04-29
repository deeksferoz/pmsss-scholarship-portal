const mongoose = require('mongoose');
const documentSchema = require('./Document');
const registrationSchema = require('./registration');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userId: {
    type: Number,  // Use Number to store the 6-digit user ID
    required: true,
    unique: true  // Ensure the userId is unique for each user
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,  // 👈 Correct!
    ref: 'Registration'                    // 👈 Reference Model Name
  },
  documents: documentSchema,        // embedded documents
  ocrData: {               // 🛠️ Add this part
    aadharText: String,
  },
  reportPath: { type: String }, // Store path of the verification report
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified'], 
    default: 'pending', // Default status is pending until verification is complete
  },
  emailSent: { type: Boolean, default: false },  // Track if the email was sent
});

module.exports = mongoose.model('User', userSchema);
