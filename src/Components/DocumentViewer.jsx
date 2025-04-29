import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DocumentViewer.css';

const DocumentViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { name: 'User' };

  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-documents/${user.email}`);
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
        alert('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user.email]);

  if (loading) return <p>Loading documents...</p>;
  if (!documents) return <p>No documents uploaded.</p>;

  const getFileName = (path) => path.split('/').pop();

  const handleDocumentClick = (filePath) => {
    window.open(`http://localhost:5000/${filePath}`, '_blank');
  };

  return (
    <>
      <h2 className="page-title">Uploaded Documents</h2>
      <h3 className="user-name">Welcome, {user.name}!</h3>

      <div className="documents-grid">
        {Object.entries(documents).map(([docType, filePath]) => (
          <div
            className="document-card"
            key={docType}
            onClick={() => handleDocumentClick(filePath)}
            style={{ cursor: 'pointer' }}
          >
            <h4>{docType}</h4>

            {/* Check if the document is a PDF or an Image */}
            {filePath.endsWith('.pdf') ? (
              <iframe
              src={`http://localhost:5000/uploads/${filePath}#page=1&zoom=100`}
              title={docType}
              className="document-preview"
              width="100%"
              height="400px"
              style={{ border: 'none' }}
            />
            ) : filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.jpeg') ? (
            <img
              src={`http://localhost:5000/uploads/${filePath}`}
              alt={docType}
              className="document-image"
              width="100%"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
            ) : (
              <p>Unsupported document type</p>
            )}

            <p>{getFileName(filePath)}</p>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={() => navigate('/dashboard', { state: { user } })}>
        Back to Dashboard
      </button>
    </>
  );
};

export default DocumentViewer;
