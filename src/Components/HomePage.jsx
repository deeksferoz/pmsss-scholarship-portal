import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleRoleSelect = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="homepage-container">
      <header className="hero-section">
        <h1>Welcome to the PMSSS Digital Scholarship Portal</h1>
        <p>A one-stop solution for students to submit, track, and manage their scholarships online.</p>
        <div className="cta-buttons">
          <button className="btn primary" onClick={() => setShowRoleSelector(true)}>Login</button>
        </div>
      </header>

      {/* Only shows when Login is clicked */}
      {showRoleSelector && (
        <div className="modal">
          <div className="modal-content">
            <h3>Login As:</h3>
            <div className="role-options">
            <div className="cta-buttons1">
                  <button className="btn" onClick={() => handleRoleSelect('student')}>Student</button>
                  <button className="btn" onClick={() => handleRoleSelect('officer')}>Officer</button>
            </div>
            </div>
            <button className="btn close" onClick={() => setShowRoleSelector(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Other sections */}
      <section className="features-section">
        <h2>What You Can Do</h2>
        <div className="features">
          <div className="feature-card">📤 Submit Documents Online</div>
          <div className="feature-card">🔍 Track Application Status</div>
          <div className="feature-card">✅ Faster Verification</div>
          <div className="feature-card">💰 Scholarship Disbursement</div>
          <div className="feature-card">🔒 Secure & Private</div>
        </div>
      </section>

      <section className="about-section">
        <h2>About PMSSS</h2>
        <p>
          The Prime Minister’s Special Scholarship Scheme (PMSSS) supports students across India in pursuing higher education. 
          Our portal enables a fully digital experience — from submission to disbursement — eliminating the need for paperwork.
        </p>
      </section>

      <section className="updates-section">
        <h2>Latest Announcements</h2>
        <ul>
          <li>🔔 Application deadline extended to April 30, 2025</li>
          <li>🛠️ Portal maintenance on April 14, 12 AM – 2 AM</li>
          <li>📢 New FAQs section now available</li>
        </ul>
      </section>

      <footer className="footer">
        <p>
          Need help? <Link to="/support">Contact Support</Link> | <Link to="/learn">Learn More</Link>
        </p>
        <p>© 2025 PMSSS Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

