import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import LoginSignup from './Components/LoginSignup';
import Dashboard from './Components/Dashboard';
import RegistrationForm from './Components/RegistrationForm';
import DocumentUpload from './Components/DocumentUpload';
import Signup from './Components/Signup';
import LoginOfficer from './Components/LoginOfficer';  
import OfficerOTP from './Components/OfficerOTP';
import DashboardOfficer from './Components/DashboardOfficer';
import DocumentViewer from './Components/DocumentViewer';
import VerifyDocuments from './Components/VerifyDocuments';
import TrackStatus from './Components/TrackStatus'; // Import this component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/student" element={<LoginSignup isLogin={true} />} />
        <Route path="/register" element={<RegistrationForm  />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-documents" element={<DocumentUpload />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login/officer" element={<LoginOfficer isLogin={true} />} />
        <Route path="/otp" element={<OfficerOTP />} />
        <Route path="/dashboardofficer" element={<DashboardOfficer />} />
        <Route path="/view-documents" element={<DocumentViewer />} />
        <Route path="/verify-documents" element={<VerifyDocuments />} />
        <Route path="/track-status" element={<TrackStatus />} />
      </Routes>
    </Router>
  );
}

export default App;
  
