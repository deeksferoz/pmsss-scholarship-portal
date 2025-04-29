import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardOfficer.css';

const DashboardOfficer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ocrResults, setOcrResults] = useState({});
  const [verificationResults, setVerificationResults] = useState({}); // Store verification status

  useEffect(() => {
    const fetchUsersDataAndOcr = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:5000/fetch-all-documents');
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);

          const ocrResponse = await fetch('http://localhost:5000/perform-ocr', { method: 'POST' });
          const ocrData = await ocrResponse.json();

          if (ocrResponse.ok && ocrData.success) {
            const results = {};
            ocrData.ocrResults.forEach(result => {
              results[result.email] = result.aadharText;
            });
            setOcrResults(results);
          } else {
            console.error('OCR failed', ocrData.message);
          }
        } else {
          alert('Failed to fetch users data');
        }
      } catch (error) {
        console.error('Error fetching users or performing OCR:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersDataAndOcr();
  }, []);

  const handleLogout = () => {
    window.location.href = '/loginOfficer';
  };

  const handleVerifyUser = async (userId) => {
    try {
      console.log('Starting verification for user:', userId);
      const response = await axios.post('http://localhost:5000/verify-ocr', { userId });

      console.log('Verification response:', response.data);

      if (!response.data.verified) {
        setVerificationResults(prev => ({ ...prev, [userId]: 'Verification Failed ❌' }));
        alert('Verification Successful');
      } else {
        setVerificationResults(prev => ({ ...prev, [userId]: 'Verified ✅' }));
        alert('Verification Failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      alert('Error occurred during verification');
    }
  };

  if (loading) {
    return <div>Loading Officer Dashboard...</div>;
  }

  return (
    <div className="dashboard-officer">
      <header className="dashboard-header">
        <div className="logo">PMSSS - Officer Dashboard</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="welcome">
        <h2>Welcome Officer!</h2>
      </div>

      <div className="user-table">
        <h3>User Documents and Aadhar OCR</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Uploaded Documents</th>
                <th>Aadhar OCR Output</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.documents ? (
                      <ul>
                        {Object.entries(user.documents).map(([docKey, docValue], idx) => (
                          <li key={idx}>
                            {docKey}: {docValue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No documents uploaded</p>
                    )}
                  </td>
                  <td>
                    <pre style={{ whiteSpace: 'pre-wrap', color: 'green' }}>
                      {ocrResults[user.email] || 'Performing OCR...'}
                    </pre>
                  </td>
                  <td>
                    {/* Corrected: Pass user._id to the function */}
                    <button onClick={() => handleVerifyUser(user._id)}>Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardOfficer;
