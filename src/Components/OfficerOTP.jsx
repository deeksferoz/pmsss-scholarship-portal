import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OfficerOTP.css';

const OfficerOTP = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.user?.email;

  const handleVerify = async () => {
    const response = await fetch('http://localhost:5000/verifyOfficerOTP', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ OTP verified successfully!');
      navigate('/dashboardofficer');
    } else {
      alert(`❌ ${result.message}`);
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP sent to your email</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerify}>Verify OTP</button>
    </div>
  );
};

export default OfficerOTP;
