import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyDocuments.css';

const VerifyDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const [ocrOutput, setOcrOutput] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-documents/${email}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  const handleVerify = async () => {
    if (!userData || !userData.documents || !userData.documents.aadharCard) {
      alert('No Aadhar card uploaded for this user.');
      return;
    }

    const fileUrl = `http://localhost:5000/${userData.documents.aadharCard}`;

    try {
      setOcrLoading(true);

      const fileResponse = await fetch(fileUrl);
      const blob = await fileResponse.blob();

      const formData = new FormData();
      formData.append('file', blob, 'aadharcard.pdf');

      const response = await fetch('http://localhost:5000/perform-ocr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setOcrOutput(result.ocrText);
        console.log('OCR Text:', result.ocrText);
      } else {
        alert(result.message || 'OCR failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during OCR request:', error);
      alert('Error during OCR processing.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/loginOfficer');
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="verify-documents">
      <header className="dashboard-header">
        <div className="logo">PMSSS - Document Verification</div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="welcome">
        <h2>Verify Documents for {userData ? userData.name : 'Loading...'}</h2>
      </div>

      <div className="ocr-upload">
        <button onClick={handleVerify} disabled={ocrLoading}>
          {ocrLoading ? 'Performing OCR...' : 'Verify Now'}
        </button>
      </div>

      <div className="ocr-output">
        {ocrOutput && (
          <>
            <h3>OCR Output:</h3>
            <pre>{ocrOutput}</pre>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyDocuments;
