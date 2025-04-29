// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');

// Import models
const User = require('./models/user');
const Officer = require('./models/officer');
const Registration = require('./models/registration');

// App setup
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/pmsss-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB - pmsss-portal'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')), // Absolute path to the uploads folder
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const userEmail = req.body.email || 'unknownUser';
    const docType = file.fieldname; // e.g., aadhar, photo, etc.
    const safeEmail = userEmail.replace(/[@.]/g, '_'); // replace @ and . for filename safety
    cb(null, `${safeEmail}_${docType}.${ext}`);
  }
});


const upload = multer({ storage });

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'daruni2801@gmail.com',
    pass: 'jwberlakhrgzyinf'
  }
});


// User Signup
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Generate a custom user ID (e.g., using a random string or username format)
    const userId = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number


    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      userId // Save the generated user ID
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the custom user ID
    res.status(201).json({
      message: 'User created successfully',
      userId: newUser.userId // Return the user ID to the frontend
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});


// User Login
app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.password !== password) return res.status(401).json({ message: 'Incorrect password' });

    res.json({
      message: 'Login successful',
      token: 'fake-jwt-token',
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Officer Signup
app.post('/signupOfficer', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const existingOfficer = await Officer.findOne({ email });
    if (existingOfficer)
      return res.status(409).json({ message: 'Officer already exists' });

    const newOfficer = new Officer({ name, email, password });
    await newOfficer.save();

    res.status(201).json({ message: 'Officer registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Officer Login
app.post('/loginOfficer', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const officer = await Officer.findOne({ email }); // hardcoded for now
    if (!officer) return res.status(401).json({ message: 'Officer not found' });
    if (officer.password !== password) return res.status(401).json({ message: 'Incorrect password' });

    res.json({
      message: 'Login successful',
      token: 'fake-jwt-token',
      user: { email: officer.email, name: officer.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/sendOfficerOTP', async (req, res) => {
    const Officer = require('./models/officer'); 
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);  // OTP expires in 5 minutes
  
    try {
      const officer = await Officer.findOne({ email });
  
      if (!officer) {
        return res.status(404).json({ message: 'Officer not found' });
      }
  
      officer.otp = { code: otp, expiresAt };
      await officer.save();
  
      // Setup email transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'daruni2801@gmail.com',
          pass: 'jwbe rlak hrgz yinf '
        }
      });
  
      const mailOptions = {
        from: '"PMSSS Portal" <daruni2801@gmail.com>',
        to: officer.email,
        subject: 'Your OTP for Officer Login',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
      };
  
      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  });
  
  // Verify OTP Endpoint
  app.post('/verifyOfficerOTP', async (req, res) => {
    const Officer = require('./models/officer'); 
  

    const { email, otp } = req.body;
  
    try {
      const officer = await Officer.findOne({ email });
  
      if (!officer || !officer.otp) {
        return res.status(400).json({ message: 'No OTP sent to this officer' });
      }
  
      const { code, expiresAt } = officer.otp;
  
      if (new Date() > expiresAt) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      if (otp !== code) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      officer.otp = null; // Reset OTP after successful verification
      await officer.save();
  
      res.json({ message: 'OTP verified successfully' });
    } catch (err) {
      console.error('Verification error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Submit Registration
app.post('/submitRegistration', async (req, res) => {
  try {
    console.log('Received registration body:', req.body);
    const { userId, ...registrationData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' }); // 💥 Add return here
    }

    const newRegistration = new Registration({
      ...registrationData,
      userId: userId
    });

    await newRegistration.save();

    res.status(201).json({ message: 'Registration submitted successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to submit registration' });
  }
});



// Upload Documents
const fixPath = (path) => path.replace(/\\/g, '/');
app.post('/upload-documents/:email', upload.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'incomeCertificate', maxCount: 1 },
  { name: 'domicileCertificate', maxCount: 1 }
]), async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    console.log('📎 Files received:', req.files);
    console.log('📧 Email from param:', email);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the file is uploaded and save the paths
    if (req.files && req.files.aadhar) {
      user.documents = {
        aadhar: req.files?.aadhar?.[0]?.filename || '',
        photo: req.files?.photo?.[0]?.filename || '',
        marksheet: req.files?.marksheet?.[0]?.filename || '',
        incomeCertificate: req.files?.incomeCertificate?.[0]?.filename || '',
        domicileCertificate: req.files?.domicileCertificate?.[0]?.filename || ''
      };

      await user.save();
      res.status(200).json({ message: 'Documents uploaded and paths saved successfully!' });
    } else {
      res.status(400).send('No files uploaded');
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Server error');
  }
});

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

// Get uploaded documents
app.get('/get-documents/:email', async (req, res) => {
  const { email } = req.params;
  const emailLower = email.trim().toLowerCase(); // Convert email to lowercase

  console.log('Fetching documents for email:', emailLower);

  try {
    const user = await User.findOne({ email: emailLower }); // Use lowercase email
    console.log('User:', user); // Log the entire user object

    

    // Log the documents object to see if the file paths are correct
    console.log('Documents:', user.documents);

    res.json({ documents: user.documents });
  } catch (error) {
    console.error('Fetch documents error:', error);
    res.status(500).send('Server error');
  }
});


// Fetch all users' documents
app.get('/fetch-all-documents', async (req, res) => {
  try {
    const users = await User.find({}).select('name email documents');
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json({ users });
  } catch (error) {
    console.error('Fetch all documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// OCR for all Aadhar card
app.post('/perform-ocr', async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users
    let ocrResults = [];

    for (const user of users) {
      const { documents } = user;

      if (documents && documents.aadhar) {
        const filePath = path.join(__dirname, 'uploads', documents.aadhar);

        if (fs.existsSync(filePath)) {
          // Preprocess the image if needed
          const processedImagePath = path.join(__dirname, 'uploads', `${user._id}_aadhar.png`);
          
          await sharp(filePath)
            .resize(1800)
            .grayscale()
            .normalize()
            .toFile(processedImagePath);

          // Perform OCR
          const { data: { text } } = await Tesseract.recognize(
            processedImagePath,
            'eng',
            {
              logger: m => console.log(m),
              tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            }
          );

          const cleanedText = text.replace(/\s+/g, ' ').trim();
          
          // Save OCR result in user document
          user.ocrData = { aadharText: cleanedText }; // Example: storing only Aadhar text
          await user.save();

          ocrResults.push({
            userId: user._id,
            name: user.name,
            email: user.email,
            aadharText: cleanedText,
          });
        } else {
          console.warn(`⚠️ Aadhar file not found for ${user.email}`);
        }
      }
    }

    if (ocrResults.length === 0) {
      return res.status(404).json({ message: 'No Aadhar cards found or OCR could not be performed' });
    }

    res.json({ success: true, ocrResults });
  } catch (error) {
    console.error('❌ Error during OCR:', error);
    res.status(500).json({ success: false, message: 'OCR failed', error: error.message });
  }
});


// Helper to clean and normalize text
function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}


// POST /verify-ocr
app.post('/verify-ocr', async (req, res) => {
  console.log('Received /verify-ocr request:', req.body);
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    console.log('Fetched user from DB:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.ocrData || !user.ocrData.aadharText) {
      console.log('OCR data missing for user');
      return res.status(404).json({ message: 'OCR data missing' });
    }

    const registration = await Registration.findOne({ userId: user.userId });
    console.log('Fetched registration:', registration);

    if (!registration) {
      console.log('Registration details not found');
      return res.status(404).json({ message: 'Registration details not found' });
    }

    const { fullName, gender, dateOfBirth, aadharNumber } = registration;
    const ocrText = user.ocrData.aadharText.toLowerCase();
    const cleanedOcrText = ocrText.replace(/[-/]/g, '').toLowerCase();
    
    const cleanedDob = dateOfBirth ? dateOfBirth.replace(/[-/]/g, '').toLowerCase() : '';
    const cleanedAadharNumber = aadharNumber.replace(/\D/g, '');
    const cleanedOcrTextAadhar = ocrText.replace(/\D/g, '');
    const dobInAadhaarFormat = formatDateToDdMmYyyy(dateOfBirth);
    const cleanedDobInAadhaarFormat = dobInAadhaarFormat.replace(/[-/]/g, '').toLowerCase();
    
    const isNameMatch = isPartialNameMatch(ocrText, fullName);
    const isGenderMatch = ocrText.includes(gender?.toLowerCase() || '');
    const isDobMatch = cleanedOcrText.includes(cleanedDobInAadhaarFormat);
    const isAadharMatch = cleanedOcrTextAadhar.includes(cleanedAadharNumber);

    console.log({ isNameMatch, isGenderMatch, isDobMatch, isAadharMatch });

    const matchCount = [isNameMatch, isGenderMatch, isDobMatch, isAadharMatch].filter(Boolean).length;

    if (matchCount >= 3) {
      // Ensure reports folder exists
      const reportsDir = path.join(__dirname, 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
      }

      const reportContent = generateReport(registration, isGenderMatch, isDobMatch, isAadharMatch);
      const doc = new PDFDocument();
      const filePath = path.join(reportsDir, `${userId}_verification_report.pdf`);
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      doc.fontSize(20).text('Verification Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(reportContent);
      doc.end();

      writeStream.on('finish', async () => {
        try {
          console.log('PDF Generated:', filePath);

          const userEmail = registration.email;
          if (!userEmail) {
            console.log('User email not found');
            return res.status(404).json({ message: 'User email not found' });
          }

          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'daruni2801@gmail.com',
              pass: 'jwbe rlak hrgz yinf'
            }
          });

          const mailOptions = {
            from: '"PMSSS Portal" <daruni2801@gmail.com>',
            to: userEmail,
            subject: 'Your Verification Report - PMSSS Portal',
            text: 'Dear User,\n\nAttached is your verification report generated after OCR checking.\n\nThank you,\nPMSSS Team',
            attachments: [
              {
                filename: `${userId}_verification_report.pdf`,
                path: filePath,
              },
            ],
          };

          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully to:', userEmail);
          user.emailSent = true; 
          await user.save(); // Mark email as sent

          user.reportPath = `reports/${userId}_verification_report.pdf`;
          user.verificationStatus = 'verified'; // Mark user as verified
          await user.save();

          return res.json({ success: true, message: 'Report generated and email sent successfully' });
        } catch (error) {
          console.error('Error sending verification email:', error);
          return res.status(500).json({ message: 'Internal server error during email sending' });
        }
      });
    } else {
      console.log('Insufficient match count:', matchCount);
      return res.status(400).json({ message: 'OCR verification failed. Insufficient match.' });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Helper functions
function formatDateToDdMmYyyy(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function isPartialNameMatch(ocrText, fullName) {
  const nameParts = fullName.toLowerCase().split(' ').filter(Boolean);
  let matchedParts = 0;
  
  for (let part of nameParts) {
    if (ocrText.includes(part)) {
      matchedParts++;
    }
  }
  
  return matchedParts >= Math.ceil(nameParts.length / 2);
}

function generateReport(registration, isGenderMatch, isDobMatch, isAadharMatch) {
  const { fullName, dateOfBirth, gender, aadharNumber, email, mobileNumber, address } = registration;
  
  return `
  ------------------------------------------------------------------------------------------------
                      VERIFICATION REPORT                     
  ------------------------------------------------------------------------------------------------                                                           
  Dear User,                                                 
                                                              
  We have completed the verification of the details you      
  provided. Below is the summary:                                                                                        
  -------------------------------------------------------------------------------------------------
  Field                 : Status                             
  -------------------------------------------------------------------------------------------------
  Gender                : ${isGenderMatch ? 'MATCHED ✅' : 'NOT MATCHED ❌'}         
  Date of Birth         : ${isDobMatch ? 'MATCHED ✅' : 'NOT MATCHED ❌'}         
  Aadhar Number         : ${isAadharMatch ? 'MATCHED ✅' : 'NOT MATCHED ❌'}         
  --------------------------------------------------------------------------------------------------                                                            
  User Information:                                          
  --------------------------------------------------------------------------------------------------
  Name                  : ${fullName}                       
  Gender                : ${gender}                         
  Date of Birth         : ${dateOfBirth}                    
  Aadhar Number         : ${aadharNumber}                   
  Email                 : ${email}                          
  Mobile Number         : ${mobileNumber}                   
  Residential Address   : ${address}                        
  ---------------------------------------------------------------------------------------------------                                                          
  Please review the information carefully and proceed        
  accordingly.                                                                                                           
  Sincerely,                                                 
  Verification System                                        
  ---------------------------------------------------------------------------------------------------
  `;
  }

// API to track user verification status
// Track user verification status
app.get('/track-status/:email', async (req, res) => {
  console.log('📩 Received /track-status request for email:', req.params);

  try {
    const { email } = req.params;
    console.log(`🔍 Fetching user with email: ${email}`);

    const user = await User.findOne({email: email});

    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', {
      email: user.email,
      verificationStatus: user.verificationStatus,
      emailSent: user.emailSent,
      reportPath: user.reportPath
    });
    return res.json({
      verificationStatus: user.verificationStatus,  // 'pending' or 'verified'
      emailSent: user.emailSent,                    // true or false
      reportPath: user.reportPath,                  // path to PDF report
      message: user.verificationStatus === 'verified'
        ? 'Documents verified and report sent to Gmail.'
        : 'Verification pending. Please wait.'
    });
    
  } catch (error) {
    console.error('💥 Error occurred while tracking status:', error);
    res.status(500).json({ 
      message: 'Server error while tracking status.',
      error: error.message 
    });
  }
});








// API to fetch report
app.get('/get-report/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });

    if (!user || !user.reportPath) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.sendFile(path.join(__dirname, user.reportPath));
  } catch (error) {
    console.error('❌ Error fetching report:', error);
    res.status(500).json({ message: 'Server error fetching report.', error: error.message });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});