import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    mobileNumber: '',
    aadharNumber: '',
    residentialAddress: '',
    city: '',
    state: '',
    pinCode: '',
    alternateContact: '',
    schoolName: '',
    boardName: '',
    courseName: '',
    courseDuration: '',
    yearOfAdmission: '',
    currentYear: '',
    rollNumber: '',
    previousYearMarks: '',
    category: '',
    annualIncome: '',
    incomeCertificateNumber: '',
    domicileCertificateNumber: '',
    previousAvailed: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData(prev => ({
      ...prev,
      previousAvailed: !prev.previousAvailed
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      // Validation check for the current step
      if (isStepValid(step)) {
        setStep(prev => prev + 1);
      } else {
        alert("❌ Please fill all required fields.");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = formData.userId;  // ✅ get userId from localStorage

    if (!userId) {
      alert("❌ User not logged in. Please login first.");
      return;
    }
    // Additional client-side validation
    if (!formData.userId || !formData.email || !formData.mobileNumber || !formData.aadharNumber) {
      alert("❌ Some required fields are missing.");
      return;
    }

    const registrationData = {
      ...formData,
      userId: userId   // ✅ include userId inside formData
    };

    try {
      const response = await fetch('http://localhost:5000/submitRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
  
      const result = await response.json();
      alert('Form Submitted Successfully!');
      navigate('/dashboard', { state: { user: { name: formData.fullName, email: formData.email } } });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.dateOfBirth && formData.gender && formData.email && formData.mobileNumber && formData.aadharNumber;
      case 2:
        return formData.residentialAddress && formData.city && formData.state && formData.pinCode;
      case 3:
        return formData.schoolName && formData.boardName && formData.courseName && formData.courseDuration && formData.yearOfAdmission && formData.currentYear && formData.rollNumber && formData.previousYearMarks;
      case 4:
        return formData.category && formData.annualIncome && formData.incomeCertificateNumber && formData.domicileCertificateNumber;
      default:
        return true;
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Registration Form</h2>
        <p className="step-indicator">Step {step} of 5</p>
        
        <form onSubmit={handleSubmit}>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="form-section">
              <h3>👤 Personal Details</h3>
              <div className="form-group">
                <input
                  name="userId"
                  placeholder="User ID"
                  value={formData.userId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              
              <div className="form-group">
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="aadharNumber"
                  placeholder="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

                    {/* STEP 2: Contact & Address */}
                    {step === 2 && (
            <div className="form-section">
              <h3>🏠 Contact & Address</h3>
              
              <div className="form-group">
                <textarea
                  name="residentialAddress"
                  placeholder="Residential Address"
                  value={formData.residentialAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="pinCode"
                  placeholder="PIN Code"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="alternateContact"
                  placeholder="Alternate Contact (Optional)"
                  value={formData.alternateContact}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="button" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 3: Academic Details */}
          {step === 3 && (
            <div className="form-section">
              <h3>🎓 Academic Details</h3>
              
              <div className="form-group">
                <input
                  name="schoolName"
                  placeholder="School/College Name"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="boardName"
                  placeholder="Board/University"
                  value={formData.boardName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="courseName"
                  placeholder="Course Name"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="courseDuration"
                  placeholder="Course Duration (e.g., 3 years)"
                  value={formData.courseDuration}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="yearOfAdmission"
                  placeholder="Year of Admission"
                  value={formData.yearOfAdmission}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="currentYear"
                  placeholder="Current Year of Study"
                  value={formData.currentYear}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="rollNumber"
                  placeholder="Roll Number / Enrollment No."
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="previousYearMarks"
                  placeholder="Previous Year Marks / Grade"
                  value={formData.previousYearMarks}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="button" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 4: Scholarship & Eligibility */}
          {step === 4 && (
            <div className="form-section">
              <h3>💼 Scholarship & Eligibility</h3>
              
              <div className="form-group">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  name="annualIncome"
                  placeholder="Annual Family Income"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="incomeCertificateNumber"
                  placeholder="Income Certificate Number"
                  value={formData.incomeCertificateNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  name="domicileCertificateNumber"
                  placeholder="Domicile Certificate Number"
                  value={formData.domicileCertificateNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.previousAvailed}
                    onChange={handleCheckboxChange}
                  />
                  Previously availed PMSSS?
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="button" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          
          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="form-section">
              <h3>📝 Final Review</h3>
              <p>Please verify your details before submitting:</p>
              
              <div className="review-details">
                <h4>Personal Details</h4>
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Mobile:</strong> {formData.mobileNumber}</p>

                <h4>Academic Details</h4>
                <p><strong>Course:</strong> {formData.courseName}</p>
                <p><strong>School/College:</strong> {formData.schoolName}</p>

                <h4>Scholarship Details</h4>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>Annual Income:</strong> {formData.annualIncome}</p>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Submit</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
