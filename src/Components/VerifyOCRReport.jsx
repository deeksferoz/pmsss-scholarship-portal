import React, { useState } from 'react';
import axios from 'axios';

const VerifyOCRReport = ({ userId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/verify-ocr', { userId });
      if (response.data.success) {
        setReport(response.data.report);
      } else {
        alert('No match found');
      }
    } catch (error) {
      console.error('Error verifying OCR:', error);
      alert('Error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Verify Aadhar Data</h1>
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify Aadhar Data'}
      </button>
      {report && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid black', padding: '10px' }}>
          <h2>Verification Report</h2>
          <pre>{report}</pre>
        </div>
      )}
    </div>
  );
};

export default VerifyOCRReport;
