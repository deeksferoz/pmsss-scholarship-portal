import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');  // State for displaying user ID
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleSignup = async () => {
    if (name.trim() === '') {
      alert('❌ Full Name is required!');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('❌ Invalid email address!');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('❌ Password must be at least 8 characters long, include a number and a special character.');
      return;
    }

    if (password !== confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(`❌ ${data.message}`);
      } else {
        // Store the userId in localStorage for future use
        localStorage.setItem('userId', data.userId);

        // Display the user ID after successful signup
        setUserId(data.userId);

        alert(`✅ ${data.message}. Your User ID is: ${data.userId}`);
        navigate('/login/student');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during signup:', error);
      alert('❌ Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Signup</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <label>Email Id</label>
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleSignup}>
          {loading ? 'Signing Up...' : 'Signup'}
        </div>
      </div>

      <div className="toggle-auth">
        Already have an account? <span onClick={() => navigate('/login/student')}>Login here</span>
      </div>

      {userId && (
        <div className="user-id-container">
          <p>Your User ID: {userId}</p>
        </div>
      )}
    </div>
  );
};

export default Signup;
