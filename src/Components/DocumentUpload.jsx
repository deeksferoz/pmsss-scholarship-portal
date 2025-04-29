import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DocumentUpload.css';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || { email: 'User' };
  
  const [files, setFiles] = useState({
    aadhar: null,
    photo: null,
    marksheet: null,
    incomeCertificate: null,
    domicileCertificate: null
  });

  const [formErrors, setFormErrors] = useState({
    aadhar: false,
    photo: false,
    marksheet: false,
    incomeCertificate: false,
    domicileCertificate: false
  });

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    setFiles({ ...files, [field]: file });
    setFormErrors({ ...formErrors, [field]: !file });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    Object.keys(files).forEach(key => {
      errors[key] = !files[key];
      if (!files[key]) isValid = false;
    });
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      alert('Please upload all required documents');
      return;
    }
  
    const formData = new FormData();
    formData.append('email', user.email);

    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });
  
    try {
      const response = await fetch(`http://localhost:5000/upload-documents/${user.email}`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload documents');
      }
  
      const result = await response.json();
      console.log('Server Response:', result);
      alert('Documents uploaded successfully!');
      navigate('/dashboard', { state: { user } });
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Error uploading documents. Please try again.');
    }
  };
  

  return (
    <div className="document-upload-container">
      <div className="document-upload-form">
        <h2 className="form-title">Upload Required Documents</h2>
        <p className="form-subtitle">Please upload clear scans of the following documents</p>
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${formErrors.aadhar ? 'error' : ''}`}>
            <label htmlFor="aadhar">Aadhar Card (PDF/Image)*</label>
            <input 
              id="aadhar"
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileChange('aadhar')} 
            />
            {formErrors.aadhar && <span className="error-message">This field is required</span>}
          </div>
          
          <div className={`form-group ${formErrors.photo ? 'error' : ''}`}>
            <label htmlFor="photo">Passport Photo (JPG/PNG)*</label>
            <input 
              id="photo"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange('photo')} 
            />
            {formErrors.photo && <span className="error-message">This field is required</span>}
          </div>
          
          <div className={`form-group ${formErrors.marksheet ? 'error' : ''}`}>
            <label htmlFor="marksheet">Latest Marksheet (PDF)*</label>
            <input 
              id="marksheet"
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange('marksheet')} 
            />
            {formErrors.marksheet && <span className="error-message">This field is required</span>}
          </div>
          
          <div className={`form-group ${formErrors.incomeCertificate ? 'error' : ''}`}>
            <label htmlFor="incomeCertificate">Income Certificate (PDF)*</label>
            <input 
              id="incomeCertificate"
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange('incomeCertificate')} 
            />
            {formErrors.incomeCertificate && <span className="error-message">This field is required</span>}
          </div>
          
          <div className={`form-group ${formErrors.domicileCertificate ? 'error' : ''}`}>
            <label htmlFor="domicileCertificate">Domicile Certificate (PDF)*</label>
            <input 
              id="domicileCertificate"
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange('domicileCertificate')} 
            />
            {formErrors.domicileCertificate && <span className="error-message">This field is required</span>}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button"
              onClick={() => navigate('/dashboard', { state: { user } })}
            >
              Back to Dashboard
            </button>
            <button type="submit" onClick={handleSubmit} className="primary-button">
              Submit Documents
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;


