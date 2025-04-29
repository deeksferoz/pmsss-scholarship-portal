import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');  // New state for userId
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!emailRegex.test(email)) {
      alert('❌ Invalid email address!');
      return;
    }

    if (password.trim().length === 0) {
      alert('❌ Password is required!');
      return;
    }

    if (!userId.trim()) {
      alert('❌ User ID is required!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, userId })  // Send userId to the backend
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Store token and userId in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);  // Store userId if available
        alert('✅ Login successful!');
        navigate('/dashboard', { state: { user: data.user } });
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Server error. Please try again later.');
      console.error(err);
    }
  };

  const goToRegister = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
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
          <label>User ID</label>
          <input
            type="text"
            placeholder="Enter your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}  // Handle userId input
            required
          />
        </div>
      </div>
      <div className="forgot-password">
        Lost Password? <span onClick={() => navigate('/forgot-password')}>Click Here!</span>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          {loading ? 'Logging in...' : 'Login'}
        </div>
      </div>
      <div className="toggle-auth">
        Don't have an account? <span onClick={goToRegister}>Signup here</span>
      </div>
    </div>
  );
};

export default LoginSignup;
