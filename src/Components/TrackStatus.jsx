import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './TrackStatus.css';

const TrackStatus = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [status, setStatus] = useState(null);

  console.log('🚀 TrackStatus Page Loaded. User:', user);

  useEffect(() => {
    if (user && user.email) {
      const fetchStatus = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/track-status/${user.email}`);
          setStatus(res.data);
        } catch (err) {
          console.error('Error fetching status:', err);
        }
      };

      fetchStatus();

      const interval = setInterval(fetchStatus, 5000); // auto refresh every 5s
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!status) {
    return (
      <div className="track-status-container">
        <div className="loading-message">Loading your verification status...</div>
      </div>
    );
  }

  if (status.verificationStatus === 'verified') {
    return (
      <div className="track-status-container">
        <div className="success-message">
          <h2>🎉 Your documents are verified!</h2>
          <p>The verification report has been sent to your registered Gmail 📩.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="track-status-container">
      <div className="pending-message">
        <h2>⌛ Your documents are under verification...</h2>
        <p>Please check again later!</p>
      </div>
    </div>
  );
};

export default TrackStatus;
