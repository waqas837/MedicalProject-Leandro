'use client';

import { useState } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Shield, 
  Camera, 
  FileText, 
  Mail, 
  Phone, 
  Heart, 
  Weight, 
  Users, 
  Star, 
  Pill, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Signature
} from 'lucide-react';

const PatientRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    currentAddress: '',
    fmpAddress: '',
    
    // Identity Verification
    patientId: '',
    ssn: '',
    selfie: null,
    signature: null,
    
    // Contact Details
    email: '',
    cellPhone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    
    // Medical Information
    weight: '',
    height: '',
    painLevel: '',
    allergies: '',
    medications: '',
    
    // Veteran Status
    isVeteran: false,
    branchOfService: '',
    
    // Documentation
    disabilityLetter: null
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Identity', icon: Shield },
    { id: 3, title: 'Contact', icon: Phone },
    { id: 4, title: 'Medical', icon: Heart },
    { id: 5, title: 'Veteran', icon: Star },
    { id: 6, title: 'Documents', icon: FileText }
  ];

  const branches = ["Army", "Marine Corps", "Navy", "Air Force", "Space Force", "Coast Guard"];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Address *</label>
              <textarea
                value={formData.currentAddress}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Registered with FMP *</label>
              <textarea
                value={formData.fmpAddress}
                onChange={(e) => handleInputChange('fmpAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Usually a US Address"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Identity Verification</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => handleInputChange('patientId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Extract Name, DOB, Sex"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Security Number *</label>
              <input
                type="password"
                value={formData.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="XXX-XX-XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Selfie *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange('selfie', e.target.files?.[0])}
                  className="hidden"
                  id="selfie-upload"
                />
                <label htmlFor="selfie-upload" className="mt-4 inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">
                  Choose File
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                <Signature className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to create your signature</p>
                <button
                  type="button"
                  className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create Signature
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cell Phone *</label>
                <input
                  type="tel"
                  value={formData.cellPhone}
                  onChange={(e) => handleInputChange('cellPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Medical Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs) *</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches) *</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Pain Level (1-9) *</label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">1 (No Pain)</span>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={formData.painLevel}
                  onChange={(e) => handleInputChange('painLevel', e.target.value)}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-500">9 (Severe Pain)</span>
                <span className="text-lg font-semibold text-emerald-600 min-w-[2rem]">{formData.painLevel || '5'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food or Drug Allergies</label>
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Please list any known allergies..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
              <textarea
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Please list all current medications..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Veteran Status</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Are you a Veteran? *</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isVeteran"
                    checked={formData.isVeteran === true}
                    onChange={() => handleInputChange('isVeteran', true)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isVeteran"
                    checked={formData.isVeteran === false}
                    onChange={() => handleInputChange('isVeteran', false)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
              </div>
            </div>

            {formData.isVeteran && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch of Service *</label>
                <select
                  value={formData.branchOfService}
                  onChange={(e) => handleInputChange('branchOfService', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <Star className="h-6 w-6 text-emerald-600" />
                <h4 className="text-lg font-semibold text-emerald-900">Thank You for Your Service</h4>
              </div>
              <p className="text-emerald-700 mt-2">
                We honor and support all veterans. Your service is greatly appreciated, and we're committed to providing you with the highest quality healthcare services.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Document Upload</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disability Letter from FMP *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload your disability letter</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleInputChange('disabilityLetter', e.target.files?.[0])}
                  className="hidden"
                  id="disability-upload"
                />
                <label htmlFor="disability-upload" className="mt-4 inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">
                  Choose File
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-900">Review & Submit</h4>
              </div>
              <p className="text-blue-700 mt-2">
                Please review all your information before submitting. Once submitted, our team will review your application and contact you within 24-48 hours.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Patient Registration
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your registration to access our premium healthcare services
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 overflow-x-auto scrollbar-hide px-4 sm:px-0">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border transition-all duration-300 ${
                        isActive 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : isCompleted 
                            ? 'bg-emerald-100 border-emerald-600 text-emerald-600' 
                            : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </div>
                      <div className="mt-1 text-center">
                        <p className={`text-xs font-medium whitespace-nowrap ${
                          isActive ? 'text-emerald-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-4 lg:w-8 h-px mx-1 lg:mx-2 ${
                        isCompleted ? 'bg-emerald-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>Submit Registration</span>
                  <CheckCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
