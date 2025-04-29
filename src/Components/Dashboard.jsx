import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || { email: 'User', name: 'User' };

  const handleUploadClick = () => {
    navigate('/upload-documents', { state: { user } });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleViewDocuments = () => {
    navigate('/view-documents', { state: { user } });
  };

  // 🚀 NEW FUNCTION FOR TRACK STATUS
  const handleTrackStatus = () => {
    navigate('/track-status', { state: { user } });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">PMSSS</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <button onClick={handleUploadClick}>Upload</button>
          <a href="/track">Track</a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="welcome">
        <h2>Welcome {user.name || user.email}!</h2>
      </div>

      <div className="actions">
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleUploadClick}>📤 Upload Documents</button>
        <button onClick={handleViewDocuments}>📃 View Documents</button>
        <button onClick={handleTrackStatus}>🔎 Track Status</button> {/* 🔥 Updated here */}
      </div>
    </div>
  );
};

export default Dashboard;
