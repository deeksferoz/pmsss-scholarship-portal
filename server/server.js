// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require('./models/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/pmsss_users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) return res.status(400).json({ message: "User already exists" });

  const user = new User({ email, password });
  await user.save();
  res.json({ message: 'User registered successfully!' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (existingUser.password !== password) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      return res.status(200).json({ message: 'Login successful', user: email.split('@')[0] });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  });

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
