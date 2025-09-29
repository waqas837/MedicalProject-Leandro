'use client';

import { useState, useEffect } from 'react';
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
  Signature,
  Building2,
  Check,
  X,
  Stethoscope
} from 'lucide-react';

// Define the facility type
interface Facility {
  id: number;
  name: string;
  city: string;
  country: string;
  country_iso: string;
  logo: string;
}

const PatientRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set());
  const [animatingFields, setAnimatingFields] = useState<Set<string>>(new Set());
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [shakingFields, setShakingFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    // Office Selection
    selectedOffice: '',
    agreeToTerms: false,
    
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

  useEffect(() => {
    fetchAllFacilities();
  }, []);

  const steps = [
    { id: 0, title: 'Office', icon: Building2 },
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Identity', icon: Shield },
    { id: 3, title: 'Contact', icon: Phone },
    { id: 4, title: 'Medical', icon: Heart },
    { id: 5, title: 'Veteran', icon: Star },
    { id: 6, title: 'Documents', icon: FileText }
  ];

  const branches = ["Army", "Marine Corps", "Navy", "Air Force", "Space Force", "Coast Guard"];

  // Validation functions
  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value && value.length >= 2;
      case 'email':
        return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'cellPhone':
        return value && /^\+?[\d\s\-\(\)]{10,}$/.test(value);
      case 'ssn':
        return value && /^\d{3}-\d{2}-\d{4}$/.test(value);
      case 'weight':
      case 'height':
        return value && !isNaN(value) && parseFloat(value) > 0;
      case 'painLevel':
        return value && parseInt(value) >= 1 && parseInt(value) <= 9;
      case 'dateOfBirth':
        return value && new Date(value) < new Date();
      case 'currentAddress':
      case 'fmpAddress':
        return value && value.length >= 10;
      case 'patientId':
        return value && value.length >= 3;
      case 'emergencyContactName':
      case 'emergencyContactPhone':
        return value && value.length >= 2;
      case 'selectedOffice':
        return value && value.length > 0;
      case 'agreeToTerms':
        return value === true;
      default:
        return value && value.length > 0;
    }
  };

  // Don't load facilities on mount - wait for country selection

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear invalid field when user starts typing
    if (invalidFields.has(field)) {
      setInvalidFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
    
    // Only add to validated fields if it becomes valid and wasn't validated before
    if (validateField(field, value) && !validatedFields.has(field)) {
      setValidatedFields(prev => new Set(prev).add(field));
      setAnimatingFields(prev => new Set(prev).add(field));
      
      // Remove from animating after animation completes
      setTimeout(() => {
        setAnimatingFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(field);
          return newSet;
        });
      }, 800);
    }
  };

  // Progressive Checkmark Component
  const AnimatedCheckmark = ({ fieldName }: { fieldName: string }) => {
    const isValid = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    const hasBeenValidated = validatedFields.has(fieldName);
    const isAnimating = animatingFields.has(fieldName);
    const isInvalid = invalidFields.has(fieldName);
    const isShaking = shakingFields.has(fieldName);
    
    // Show red cross if invalid
    if (isInvalid) {
      return (
        <div className="inline-flex items-center ml-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </div>
        </div>
      );
    }
    
    // Show green checkmark if valid
    if (!isValid || !hasBeenValidated) return null;
    
    return (
      <div className="inline-flex items-center ml-2">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg 
            className="w-3 h-3 text-white" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{
              strokeDasharray: '20',
              strokeDashoffset: isAnimating ? '20' : '0',
              animation: isAnimating ? 'drawCheck 0.8s ease-in-out forwards' : 'none'
            }}
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    );
  };

  const fetchAllFacilities = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/facilities');
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Check if data.data exists and is an array
        if (data.data && Array.isArray(data.data)) {
          // The API route already fetches logos, so use the data directly
          console.log('Transformed facilities:', data.data); // Debug log
          setFacilities(data.data);
        } else {
          console.error('Invalid API response structure:', data);
          // Fallback to mock data
          const mockFacilities = [
            { id: 2, name: 'Holistic Care Puerto Plata', city: 'Puerto Plata', country: 'Dominican Republic', country_iso: 'DO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/2/2_logo.png' },
            { id: 3, name: 'Purple Heart Health', city: 'Medellin', country: 'Colombia', country_iso: 'CO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/3/3_logo.png' },
            { id: 4, name: 'Holistic Care Sosua', city: 'Sosua', country: 'Dominican Republic', country_iso: 'DO', logo: '' }
          ];
          setFacilities(mockFacilities);
        }
      } else {
        console.error('Failed to fetch facilities');
        // Fallback to mock data
        const mockFacilities = [
          { id: 2, name: 'Holistic Care Puerto Plata', city: 'Puerto Plata', country: 'Dominican Republic', country_iso: 'DO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/2/2_logo.png' },
          { id: 3, name: 'Purple Heart Health', city: 'Medellin', country: 'Colombia', country_iso: 'CO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/3/3_logo.png' },
          { id: 4, name: 'Holistic Care Sosua', city: 'Sosua', country: 'Dominican Republic', country_iso: 'DO', logo: '' }
        ];
        setFacilities(mockFacilities);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Fallback to mock data
      const mockFacilities = [
        { id: 2, name: 'Holistic Care Puerto Plata', city: 'Puerto Plata', country: 'Dominican Republic', country_iso: 'DO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/2/2_logo.png' },
        { id: 3, name: 'Purple Heart Health', city: 'Medellin', country: 'Colombia', country_iso: 'CO', logo: 'https://orkachart.s3.us-east-2.amazonaws.com/api/facilities/3/3_logo.png' },
        { id: 4, name: 'Holistic Care Sosua', city: 'Sosua', country: 'Dominican Republic', country_iso: 'DO', logo: '' }
      ];
      setFacilities(mockFacilities);
    }
    setLoading(false);
  };

  const fetchFacilitiesByCountry = async (countryCode: string) => {
    setLoading(true);
    try {
      // Call our server-side API route with country parameter
      const response = await fetch(`/api/facilities?country=${countryCode}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setFacilities(data.data);
      } else {
        throw new Error('Failed to fetch facilities');
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Mock data for development
      const mockFacilities = countryCode === 'CO' 
        ? [
            { id: 4, name: 'Bogotá Medical Center', city: 'Bogotá', country: 'Colombia', country_iso: 'CO', logo: '' },
            { id: 5, name: 'Medellín Healthcare', city: 'Medellín', country: 'Colombia', country_iso: 'CO', logo: '' }
          ]
        : [
            { id: 1, name: 'Puerto Plata Medical', city: 'Puerto Plata', country: 'Dominican Republic', country_iso: 'DO', logo: '' },
            { id: 2, name: 'Sosua Health Center', city: 'Sosua', country: 'Dominican Republic', country_iso: 'DO', logo: '' },
            { id: 3, name: 'Bavaro Clinic', city: 'Bavaro', country: 'Dominican Republic', country_iso: 'DO', logo: '' }
          ];
      setFacilities(mockFacilities);
    }
    setLoading(false);
  };

  const nextStep = () => {
    // Validate current step fields
    const currentStepFields = getCurrentStepFields();
    const invalidFieldsInStep = currentStepFields.filter(field => !validateField(field, formData[field as keyof typeof formData]));
    
    if (invalidFieldsInStep.length > 0) {
      // Show red crosses for invalid fields
      setInvalidFields(new Set(invalidFieldsInStep));
      
      // Shake animation for invalid fields
      setShakingFields(new Set(invalidFieldsInStep));
      setTimeout(() => {
        setShakingFields(new Set());
      }, 500);
      
      // Auto-scroll to first invalid field on mobile
      setTimeout(() => {
        const firstInvalidField = document.querySelector(`input[name="${invalidFieldsInStep[0]}"]`) || 
                                 document.querySelector(`select[name="${invalidFieldsInStep[0]}"]`) ||
                                 document.querySelector(`textarea[name="${invalidFieldsInStep[0]}"]`);
        
        if (firstInvalidField) {
          firstInvalidField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          // Focus the field for better mobile UX
          (firstInvalidField as HTMLElement).focus();
        }
      }, 100);
      
      return; // Don't proceed to next step
    }
    
    // Clear invalid fields if all are valid
    setInvalidFields(new Set());
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Scroll to form after step change
      setTimeout(() => {
        const formElement = document.querySelector('.bg-white\\/80');
        if (formElement) {
          formElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  };

  const goToStep = (stepIndex: number) => {
    // Only allow going to steps that have been completed or are the next step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
      setInvalidFields(new Set());
      setShakingFields(new Set());
    }
  };

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: return ['selectedOffice', 'agreeToTerms'];
      case 1: return ['firstName', 'lastName', 'dateOfBirth', 'currentAddress', 'fmpAddress'];
      case 2: return ['patientId', 'ssn'];
      case 3: return ['email', 'cellPhone', 'emergencyContactName', 'emergencyContactPhone'];
      case 4: return ['weight', 'height', 'painLevel'];
      case 5: return ['isVeteran'];
      case 6: return ['disabilityLetter'];
      default: return [];
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Submit to our server-side API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('Registration successful:', result);
        alert('Registration submitted successfully!');
      } else {
        console.error('Registration failed:', result);
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
    
    // Also output JSON for backend developer
    console.log('Form data:', formData);
    console.log('JSON for backend:', JSON.stringify(formData, null, 2));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="text-center bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">Welcome to Patient Registration</h3>
              <p className="text-emerald-700">Please select your preferred office location to begin</p>
            </div>

            {/* Office Selection as Icons */}
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Your Office</h4>
              <p className="text-gray-600 mb-6">Click on an office to select it</p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {facilities.map((facility, index) => {
                  const facilityId = facility?.id?.toString() || `facility-${index}`;
                  return (
                    <div
                      key={facilityId}
                      onClick={() => handleInputChange('selectedOffice', facilityId)}
                      className={`relative flex flex-col items-center p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 w-full sm:w-auto sm:min-w-[200px] max-w-[280px] ${
                        formData.selectedOffice === facilityId
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                    {/* Company Logo (if available) */}
                    {facility.logo ? (
                      <div className="w-24 h-24 mb-4 flex items-center justify-center relative">
                        <img 
                          src={facility.logo} 
                          alt={`${facility.name} logo`}
                          className="w-full h-full object-contain"
                        />
                        {/* Medical Icon Overlay */}
                        <div 
                          className="absolute -top-2 -left-4 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-help group"
                        >
                          <Stethoscope className="w-3 h-3 text-gray-600" />
                          {/* Animated Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            Medical Facility
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Office Icon (fallback when no logo) */
                      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-emerald-100 rounded-full">
                        <Stethoscope className="w-8 h-8 text-emerald-600" />
                      </div>
                    )}
                    
                    {/* Office Name */}
                    <h5 className="font-semibold text-gray-900 text-center mb-2">{facility.name}</h5>
                    <p className="text-sm text-gray-600 text-center">{facility.city}</p>
                    <p className="text-xs text-gray-500 text-center">{facility.country}</p>
                    
                    {/* Selection Checkmark */}
                    {formData.selectedOffice === facilityId && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="border-t pt-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-500 underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-emerald-600 hover:text-emerald-500 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {invalidFields.has('agreeToTerms') && (
                <div className="mt-3 flex items-center text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Please agree to terms</span>
                </div>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  First Name *
                  <AnimatedCheckmark fieldName="firstName" />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    shakingFields.has('firstName') ? 'shake border-red-500' : ''
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Last Name *
                  <AnimatedCheckmark fieldName="lastName" />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    shakingFields.has('lastName') ? 'shake border-red-500' : ''
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Date of Birth *
                <AnimatedCheckmark fieldName="dateOfBirth" />
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  shakingFields.has('dateOfBirth') ? 'shake border-red-500' : ''
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Current Address *
                <AnimatedCheckmark fieldName="currentAddress" />
              </label>
              <textarea
                value={formData.currentAddress}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Address Registered with FMP *
                <AnimatedCheckmark fieldName="fmpAddress" />
              </label>
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
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    shakingFields.has('email') ? 'shake border-red-500' : ''
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cell Phone *</label>
                <input
                  type="tel"
                  value={formData.cellPhone}
                  onChange={(e) => handleInputChange('cellPhone', e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    shakingFields.has('cellPhone') ? 'shake border-red-500' : ''
                  }`}
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
            {/* <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Veteran Status</h3> */}
            
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl font-black text-gray-900 mb-2">Are you a Veteran? *</h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
              </div>
              <div className="flex justify-center space-x-8">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isVeteran"
                    checked={formData.isVeteran === true}
                    onChange={() => handleInputChange('isVeteran', true)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 text-lg font-medium">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isVeteran"
                    checked={formData.isVeteran === false}
                    onChange={() => handleInputChange('isVeteran', false)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 text-lg font-medium">No</span>
                </label>
              </div>
            </div>

            {/* Warning message for "No" selection */}
            {formData.isVeteran === false && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                <div className="text-amber-600 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Service Limitation Notice</h3>
                <p className="text-amber-700">
                  Our services are only available for US veterans at this moment. We apologize for any inconvenience.
                </p>
              </div>
            )}

            {/* Branch selection for "Yes" */}
            {formData.isVeteran === true && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-6 text-center">Select Your Branch of Service *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {branches.map((branch, index) => (
                    <div
                      key={branch}
                      onClick={() => handleInputChange('branchOfService', branch)}
                      className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.branchOfService === branch
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="w-16 h-16 mb-3 flex items-center justify-center">
                        <img 
                          src={`/${index + 1}.jpg`}
                          alt={`${branch} emblem`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-center text-sm">{branch}</h4>
                      {formData.branchOfService === branch && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 py-4 sm:py-12">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Patient Registration
            </span>
          </h1>
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
                      <div 
                        onClick={() => goToStep(step.id)}
                        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border transition-all duration-300 cursor-pointer hover:scale-105 ${
                          isActive 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : isCompleted 
                              ? 'bg-emerald-100 border-emerald-600 text-emerald-600 hover:bg-emerald-200' 
                              : currentStep >= step.id - 1
                                ? 'bg-white border-gray-300 text-gray-400 hover:bg-gray-50 hover:border-gray-400'
                                : 'bg-white border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                      >
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-4 sm:p-8">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-full sm:w-auto ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
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
