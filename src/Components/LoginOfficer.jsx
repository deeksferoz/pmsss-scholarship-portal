import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginOfficer.css';

const LoginOfficer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    console.log('Login button clicked');
    if (!emailRegex.test(email)) {
      alert('❌ Invalid email address!');
      return;
    }

    if (password.trim().length === 0) {
      alert('❌ Password is required!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/loginOfficer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('✅ Login successful!');

        
        // Trigger sendOTP after successful login
        const otpResponse = await fetch('http://localhost:5000/sendOfficerOTP', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const otpData = await otpResponse.json();
        console.log(otpData);

        if (otpResponse.ok) {
          alert('✅ OTP sent to your email!');
          navigate('/otp', { state: { user: data.user } });
        } else {
          alert(`❌ Failed to send OTP: ${otpData.message}`);
        }
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error during login:', err);
      alert('❌ Server error. Please try again later.');
      console.error(err);
    }
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
      </div>
      <div className="forgot-password">
        Lost Password? <span>Click Here!</span>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={handleLogin}>
          {loading ? 'Logging in...' : 'Login'}
        </div>
      </div>
    </div>
  );
};

export default LoginOfficer;
