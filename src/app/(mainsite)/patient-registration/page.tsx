'use client';

import { useState, useEffect, useRef } from 'react';
import ReactCountryFlag from 'react-country-flag';
import SignatureCanvas from 'react-signature-canvas';
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
  FileSignature,
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
  const [insurances, setInsurances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set());
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [animatingFields, setAnimatingFields] = useState<Set<string>>(new Set());
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [shakingFields, setShakingFields] = useState<Set<string>>(new Set());
  const [isProcessingID, setIsProcessingID] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  
  // Google Places autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [detectedCountry, setDetectedCountry] = useState('CO');
  const [formData, setFormData] = useState({
    // Office Selection
    selectedOffice: '',
    agreeToTerms: false,
    
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    dobMonth: '',
    dobDay: '',
    dobYear: '',
    
    // Address Information
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentZip: '',
    currentCountry: '',
    fmpAddress: '',
    fmpCity: '',
    fmpState: '',
    fmpZip: '',
    fmpCountry: '',
    
    // ID Card Upload
    idCardImage: null,
    extractedFirstName: '',
    extractedLastName: '',
    extractedDOB: '',
    extractedSex: '',
    
    // Identity Verification
    patientId: '',
    ssn: '',
    selfie: null,
    signature: null,
    
    // Contact Details
    email: '',
    cellPhone: '',
    phoneCountry: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    
    // Medical Information
    weight: '',
    heightFeet: '',
    heightInches: '',
    painLevel: '0',
    medications: [],
    medicationInput: '',
    
    // Insurance Information
    selectedInsurance: '',
    
    // Veteran Status
    isVeteran: null,
    branchOfService: '',
    
    // Documentation
    hasDisabilityLetter: null,
    disabilityLetter: null,
    
    // Consent and Signature
    patientSignature: '',
    consentAccepted: false
  });

  useEffect(() => {
    // Set detected country on client side to avoid hydration mismatch
    setDetectedCountry(detectCountryFromDomain());
  }, []);

  useEffect(() => {
    // Fetch data after country is detected
    if (detectedCountry) {
    fetchAllFacilities();
    fetchInsurances();
    }
  }, [detectedCountry]);

  // Auto-populate DOB and Sex from extracted data
  useEffect(() => {
    if (formData.extractedDOB && !formData.dobMonth && !formData.dobDay && !formData.dobYear) {
      const dob = new Date(formData.extractedDOB);
      if (!isNaN(dob.getTime())) {
        setFormData(prev => ({
          ...prev,
          dobMonth: (dob.getMonth() + 1).toString(),
          dobDay: dob.getDate().toString(),
          dobYear: dob.getFullYear().toString()
        }));
      }
    }
    
    if (formData.extractedSex && !formData.sex) {
      const sexValue = formData.extractedSex === 'Male' ? 'M' : formData.extractedSex === 'Female' ? 'F' : '';
      if (sexValue) {
        setFormData(prev => ({
          ...prev,
          sex: sexValue
        }));
      }
    }
  }, [formData.extractedDOB, formData.extractedSex]);

  // Validate DOB for 18+ requirement
  useEffect(() => {
    if (formData.dobMonth && formData.dobDay && formData.dobYear) {
      const dob = new Date(parseInt(formData.dobYear), parseInt(formData.dobMonth) - 1, parseInt(formData.dobDay));
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      // Check if birthday has passed this year
      const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= dob.getDate());
      const actualAge = isBirthdayPassed ? age : age - 1;
      
      if (actualAge < 18) {
        setInvalidFields(prev => new Set(prev).add('dateOfBirth'));
      } else {
        setInvalidFields(prev => {
          const newSet = new Set(prev);
          newSet.delete('dateOfBirth');
          return newSet;
        });
      }
    }
  }, [formData.dobMonth, formData.dobDay, formData.dobYear]);

  const steps = [
    { id: 0, title: 'Office', icon: Building2 },
    { id: 1, title: 'Veteran', icon: Star },
    { id: 2, title: 'ID Card', icon: Shield },
    { id: 3, title: 'Review Data', icon: CheckCircle },
    { id: 4, title: 'Personal Info', icon: User },
    { id: 5, title: 'Identity', icon: User },
    { id: 6, title: 'Contact', icon: Phone },
    { id: 7, title: 'Medical', icon: Heart },
    { id: 8, title: 'Insurance', icon: Shield },
    { id: 9, title: 'Documents', icon: FileText },
    { id: 10, title: 'Consent', icon: FileSignature }
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
        // Remove all non-numeric characters and check length
        const phoneDigits = value.replace(/\D/g, '');
        // Accept phone numbers with exactly 10-15 digits (specific length)
        return phoneDigits && phoneDigits.length >= 10 && phoneDigits.length <= 15;
      case 'phoneCountry':
        return value && value.length > 0 && (value === 'US' || value === 'CO');
      case 'ssn':
        return value && /^\d{9}$/.test(value);
      case 'weight':
      case 'height':
        return value && !isNaN(value) && parseFloat(value) > 0;
      case 'painLevel':
        return value && parseInt(value) >= 1 && parseInt(value) <= 9;
      case 'dateOfBirth':
        // Check if all DOB components are filled and person is 18+
        if (formData.dobMonth && formData.dobDay && formData.dobYear) {
          const dob = new Date(parseInt(formData.dobYear), parseInt(formData.dobMonth) - 1, parseInt(formData.dobDay));
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          
          // Check if birthday has passed this year
          const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= dob.getDate());
          const actualAge = isBirthdayPassed ? age : age - 1;
          
          return actualAge >= 18;
        }
        return false;
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
      case 'idCardImage':
        return value !== null && value !== '';
      case 'sex':
        return value && (value === 'M' || value === 'F');
      case 'dobMonth':
        return value && parseInt(value) >= 1 && parseInt(value) <= 12;
      case 'dobDay':
        return value && parseInt(value) >= 1 && parseInt(value) <= 31;
      case 'dobYear':
        return value && parseInt(value) >= 1900 && parseInt(value) <= new Date().getFullYear();
      // Step 2 - Extracted data validation
      case 'extractedFirstName':
      case 'extractedLastName':
        return value && value.length >= 2;
      case 'extractedDOB':
        return value && value.length > 0;
      case 'extractedSex':
        return value && (value === 'Male' || value === 'Female');
      // Step 5 - Address fields validation
      case 'currentCity':
      case 'currentState':
      case 'fmpCity':
      case 'fmpState':
        return value && value.length >= 2;
      case 'currentZip':
      case 'fmpZip':
        return value && value.length >= 3; // More flexible ZIP/postal code validation
      case 'currentCountry':
      case 'fmpCountry':
        return value && value.length > 0;
      // Step 6 - Height validation
      case 'heightFeet':
        return value && parseInt(value) >= 3 && parseInt(value) <= 8;
      case 'heightInches':
        return value && parseInt(value) >= 0 && parseInt(value) <= 11;
      case 'height':
        // Combined height validation (feet + inches)
        const feet = parseInt(formData.heightFeet) || 0;
        const inches = parseInt(formData.heightInches) || 0;
        // Simple validation: if both fields have values, it's valid
        return feet > 0 && inches >= 0;
      // Step 7 - Insurance validation
      case 'selectedInsurance':
        return value && value.length > 0;
      // Step 8 - Veteran validation
      case 'isVeteran':
        return value === true || value === false;
      case 'branchOfService':
        return value && value.length > 0;
      // Step 9 - Disability letter validation
      case 'hasDisabilityLetter':
        return value === true || value === false;
      // Step 7 - Medications validation
      case 'medications':
        return value && Array.isArray(value) && value.length > 0;
      case 'disabilityLetter':
        // Only validate if user said they have the letter
        if (formData.hasDisabilityLetter === true) {
          return value && value !== null;
        }
        return true; // Not required if user doesn't have the letter
      // Step 10 - Signature and consent validation
      case 'patientSignature':
        return value && value.length > 0;
      case 'consentAccepted':
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

  // Google Places autocomplete functions
  const fetchAddressSuggestions = async (input: string, field: string) => {
    if (input.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}&country=US`);
      const data = await response.json();
      
      if (data.predictions) {
        setAddressSuggestions(data.predictions);
        setShowSuggestions(true);
        setActiveField(field);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const handleAddressSelect = async (placeId: string, field: string) => {
    // Immediately hide suggestions to prevent blur interference
    setShowSuggestions(false);
    setAddressSuggestions([]);
    
    try {
      const response = await fetch(`/api/places/details?place_id=${placeId}`);
      const data = await response.json();
      
      if (data.result) {
        const address = data.result.formatted_address;
        const components = data.result.address_components;
        
        // Extract city, state, zip from address components
        let city = '';
        let state = '';
        let zip = '';
        
        components.forEach((component: any) => {
          if (component.types.includes('locality')) city = component.long_name;
          if (component.types.includes('administrative_area_level_1')) state = component.short_name;
          if (component.types.includes('postal_code')) zip = component.long_name;
        });
        
        // Update the appropriate address field
        if (field === 'currentAddress') {
          setFormData(prev => ({
            ...prev,
            currentAddress: address,
            currentCity: city,
            currentState: state,
            currentZip: zip,
            currentCountry: 'US'
          }));
        } else if (field === 'fmpAddress') {
          setFormData(prev => ({
            ...prev,
            fmpAddress: address,
            fmpCity: city,
            fmpState: state,
            fmpZip: zip,
            fmpCountry: 'US'
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
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

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleIDCardUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      
      // Set the image in form data
      handleInputChange('idCardImage', imageData);
      setIsProcessingID(true);

      try {
        // Call the API to process the ID
        const response = await fetch('/api/process-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
          // Handle both HTTP errors and API errors gracefully
          showToast(result.error || 'Error processing ID card. Please try again.', 'error');
        } else {
          // Update form data with extracted information
          handleInputChange('extractedFirstName', result.firstName || '');
          handleInputChange('extractedLastName', result.lastName || '');
          handleInputChange('extractedDOB', result.dob || '');
          handleInputChange('extractedSex', result.sex || '');
          showToast('ID card processed successfully!', 'success');
          
          // Auto-advance to next step after successful extraction
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 1500); // Wait 1.5 seconds to show success message
        }
      } catch (error) {
        console.error('Network error processing ID:', error);
        showToast('Network error. Please check your connection and try again.', 'error');
      } finally {
        setIsProcessingID(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Function to detect country from domain
  const detectCountryFromDomain = () => {
    if (typeof window === 'undefined') return 'CO'; // Default for SSR
    
    const hostname = window.location.hostname;
    
    // Production domain mapping
    if (hostname === 'purple.orkachart.com') return 'CO';
    if (hostname === 'holistic.orkachart.com') return 'DO';
    
    // Development URL parameter support
    const urlParams = new URLSearchParams(window.location.search);
    const countryParam = urlParams.get('country');
    if (countryParam === 'CO' || countryParam === 'DO') {
      return countryParam;
    }
    
    // Default fallback for development
    return 'CO';
  };


  const fetchAllFacilities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/facilities?country=${detectedCountry}`);
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

  // Fetch insurances
  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/insurances?country=${detectedCountry}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Transform the data to match our expected format
        const transformedInsurances = data.data.map((insurance: any) => ({
          id: insurance.id_insurance_company_country,
          company: insurance.company,
          code: insurance.code || 'N/A',
          country_iso: insurance.country_iso
        }));
        setInsurances(transformedInsurances);
      } else {
        console.error('Failed to fetch insurances:', data);
      }
    } catch (error) {
      console.error('Error fetching insurances:', error);
    } finally {
      setLoading(false);
    }
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

  const handleSignatureEnd = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();
      handleInputChange('patientSignature', signatureData);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      handleInputChange('patientSignature', '');
    }
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
    // Allow going to any step (0-10)
    if (stepIndex >= 0 && stepIndex <= 10) {
      setCurrentStep(stepIndex);
      setInvalidFields(new Set());
      setShakingFields(new Set());
    }
  };

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: return ['selectedOffice', 'agreeToTerms'];
      case 1: return formData.isVeteran === true ? ['isVeteran', 'branchOfService'] : ['isVeteran'];
      case 2: return ['idCardImage'];
      case 3: return ['extractedFirstName', 'extractedLastName', 'extractedDOB', 'extractedSex'];
      case 4: return ['email', 'cellPhone', 'phoneCountry', 'sex', 'ssn', 'dobMonth', 'dobDay', 'dobYear', 'dateOfBirth'];
      case 5: return ['selfie'];
      case 6: return ['currentAddress', 'currentCity', 'currentState', 'currentZip', 'currentCountry', 'fmpAddress', 'fmpCity', 'fmpState', 'fmpZip', 'fmpCountry'];
      case 7: return ['medications'];
      case 8: return ['selectedInsurance'];
      case 9: return ['hasDisabilityLetter', 'disabilityLetter'];
      case 10: return ['patientSignature', 'consentAccepted'];
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
    
    // Validate signature and consent before submission
    if (!formData.patientSignature || formData.patientSignature.trim().length === 0) {
      setInvalidFields(prev => new Set([...prev, 'patientSignature']));
      setShakingFields(prev => new Set([...prev, 'patientSignature']));
      setTimeout(() => setShakingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete('patientSignature');
        return newSet;
      }), 500);
      return;
    }
    
    if (!formData.consentAccepted) {
      setInvalidFields(prev => new Set([...prev, 'consentAccepted']));
      setShakingFields(prev => new Set([...prev, 'consentAccepted']));
      setTimeout(() => setShakingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete('consentAccepted');
        return newSet;
      }), 500);
      return;
    }
    
    try {
      // Submit to our server-side API - COMMENTED OUT FOR NOW
      /*
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
      */
      
      // Temporary success message for testing
      console.log('Form validation passed - API call commented out');
      alert('Form validation passed! (API call is commented out)');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
    
    // Create comprehensive JSON structure for backend
    const comprehensiveFormData = {
      // Registration Metadata
      registration: {
        timestamp: new Date().toISOString(),
        step: currentStep,
        completed: true
      },
      
      // Office Selection
      office: {
        selectedOffice: formData.selectedOffice,
        agreeToTerms: formData.agreeToTerms
      },
      
      // Personal Information
      personalInfo: {
        firstName: formData.firstName || formData.extractedFirstName,
        lastName: formData.lastName || formData.extractedLastName,
        dateOfBirth: formData.dateOfBirth || formData.extractedDOB,
        sex: formData.sex || formData.extractedSex,
        dobComponents: {
          month: formData.dobMonth,
          day: formData.dobDay,
          year: formData.dobYear
        }
      },
      
      // Address Information
      addresses: {
        current: {
          address: formData.currentAddress,
          city: formData.currentCity,
          state: formData.currentState,
          zip: formData.currentZip,
          country: formData.currentCountry
        },
        fmp: {
          address: formData.fmpAddress,
          city: formData.fmpCity,
          state: formData.fmpState,
          zip: formData.fmpZip,
          country: formData.fmpCountry
        }
      },
      
      // Identity Verification
      identity: {
        patientId: formData.patientId,
        ssn: formData.ssn,
        idCardUploaded: !!formData.idCardImage,
        selfieUploaded: !!formData.selfie,
        extractedData: {
          firstName: formData.extractedFirstName,
          lastName: formData.extractedLastName,
          dateOfBirth: formData.extractedDOB,
          sex: formData.extractedSex
        }
      },
      
      // Contact Information
      contact: {
        email: formData.email,
        cellPhone: formData.cellPhone,
        phoneCountry: formData.phoneCountry,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone
        }
      },
      
      // Medical Information
      medical: {
        physical: {
          weight: formData.weight,
          height: {
            feet: formData.heightFeet,
            inches: formData.heightInches
          },
          painLevel: formData.painLevel
        },
        medications: formData.medications
      },
      
      // Insurance Information
      insurance: {
        selectedInsurance: formData.selectedInsurance
      },
      
      // Veteran Status
      veteran: {
        isVeteran: formData.isVeteran,
        branchOfService: formData.branchOfService
      },
      
      // Documentation
      documentation: {
        hasDisabilityLetter: formData.hasDisabilityLetter,
        disabilityLetterUploaded: !!formData.disabilityLetter
      },
      
      // Consent and Signature
      consent: {
        patientSignature: formData.patientSignature,
        consentAccepted: formData.consentAccepted,
        signatureTimestamp: formData.patientSignature ? new Date().toISOString() : null
      },
      
      // File Attachments (Base64 encoded)
      attachments: {
        idCard: formData.idCardImage,
        selfie: formData.selfie,
        disabilityLetter: formData.disabilityLetter
      }
    };
    
    // Output clean submitted data
    console.log('SUBMITTED DATA:', JSON.stringify(comprehensiveFormData, null, 2));
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
              
              {/* Development Country Selector */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">Development Mode - Country Selector:</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => window.location.href = `${window.location.pathname}?country=CO`}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Colombia (CO)
                    </button>
                    <button
                      onClick={() => window.location.href = `${window.location.pathname}?country=DO`}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Dominican Republic (DO)
                    </button>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    Current: {detectedCountry}
                  </p>
                </div>
              )}
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
                          : invalidFields.has('selectedOffice')
                          ? 'border-red-500 bg-red-50 shake'
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

            {/* Office Selection Validation Error */}
            {invalidFields.has('selectedOffice') && (
              <div className="mt-4 flex items-center text-red-600">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm">Please select an office location</span>
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
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl font-black text-gray-900 mb-2 flex items-center justify-center">
                  Are you a Veteran? *
                  <AnimatedCheckmark fieldName="isVeteran" />
                </h2>
                <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
              </div>
              <div className={`flex justify-center space-x-8 ${
                invalidFields.has('isVeteran') ? 'shake' : ''
              }`}>
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

            {/* Branch selection for "Yes" */}
            {formData.isVeteran === true && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-6 text-center flex items-center justify-center">
                  Select Your Branch of Service *
                  <AnimatedCheckmark fieldName="branchOfService" />
                </label>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${
                  invalidFields.has('branchOfService') ? 'shake' : ''
                }`}>
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">ID Card Upload</h3>
            
            {/* ID Card Upload Section */}
            <div className={`bg-gray-50 border-2 border-dashed rounded-lg p-8 text-center ${
              invalidFields.has('idCardImage') 
                ? 'border-red-500 bg-red-50 shake' 
                : 'border-gray-300'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload Your ID Card</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Please upload a clear photo of your driver's license, passport, or state ID
                  </p>
                </div>

                {!formData.idCardImage ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIDCardUpload}
                      className="hidden"
                      id="id-card-upload"
                    />
                    <label
                      htmlFor="id-card-upload"
                      className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Take Photo or Upload</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={formData.idCardImage}
                        alt="Uploaded ID Card"
                        className="mx-auto max-w-sm rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => handleInputChange('idCardImage', null)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {isProcessingID ? (
                        <div className="flex items-center justify-center space-x-2 text-emerald-600">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                          <span className="font-medium">Processing ID Card...</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            // Reset all ID card related data
                            handleInputChange('idCardImage', null);
                            handleInputChange('extractedFirstName', '');
                            handleInputChange('extractedLastName', '');
                            handleInputChange('extractedDOB', '');
                            handleInputChange('extractedSex', '');
                            setIsProcessingID(false);
                          }}
                          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                          <Camera className="w-5 h-5" />
                          <span>Retake Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ID Card Upload Validation Error */}
            {invalidFields.has('idCardImage') && (
              <div className="mt-4 flex items-center text-red-600">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm">Please upload your ID card</span>
              </div>
            )}

          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Review & Edit Extracted Data</h3>
            
            {/* Extracted Data Display */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Information Extracted from ID Card
              </h4>
              <p className="text-sm text-emerald-700 mb-6">
                Please review and correct the information extracted from your ID card. You can edit any field if needed.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="extractedFirstName"
                    value={formData.extractedFirstName}
                    onChange={(e) => handleInputChange('extractedFirstName', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      shakingFields.has('extractedFirstName') ? 'shake border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="extractedLastName"
                    value={formData.extractedLastName}
                    onChange={(e) => handleInputChange('extractedLastName', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      shakingFields.has('extractedLastName') ? 'shake border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="extractedDOB"
                    value={formData.extractedDOB}
                    onChange={(e) => handleInputChange('extractedDOB', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      shakingFields.has('extractedDOB') ? 'shake border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex *</label>
                  <select
                    name="extractedSex"
                    value={formData.extractedSex}
                    onChange={(e) => handleInputChange('extractedSex', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      shakingFields.has('extractedSex') ? 'shake border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            

            {/* Personal Information Form */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900">Additional Information</h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Email Address *
                    <AnimatedCheckmark fieldName="email" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('email') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Cell Phone *
                    <AnimatedCheckmark fieldName="cellPhone" />
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <div className="flex items-center px-3 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
                        {formData.phoneCountry && (
                        <ReactCountryFlag 
                          countryCode={formData.phoneCountry} 
                          svg 
                          style={{ width: '1.2em', height: '1.2em', marginRight: '8px' }} 
                        />
                        )}
                        <span className="flex-1 text-gray-900">
                          {formData.phoneCountry === 'US' ? 'US' : formData.phoneCountry === 'CO' ? 'CO' : 'Select'}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <select
                          name="phoneCountry"
                          value={formData.phoneCountry}
                          onChange={(e) => handleInputChange('phoneCountry', e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="US">US</option>
                          <option value="CO">Colombia</option>
                        </select>
                      </div>
                    </div>
                    <input
                      type="tel"
                      name="cellPhone"
                      value={formData.cellPhone}
                      onChange={(e) => {
                        // Only allow numbers and limit to 10 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleInputChange('cellPhone', value);
                      }}
                      className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        shakingFields.has('cellPhone') ? 'shake border-red-500' : ''
                      }`}
                      placeholder="1234567890"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 10 digits
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Sex *
                    <AnimatedCheckmark fieldName="sex" />
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={(e) => handleInputChange('sex', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('sex') ? 'shake border-red-500' : ''
                    }`}
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Social Security Number *
                    <AnimatedCheckmark fieldName="ssn" />
                  </label>
                  <input
                    type="password"
                    name="ssn"
                    value={formData.ssn}
                    onChange={(e) => {
                      // Only allow numbers and limit to 9 digits
                      const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                      handleInputChange('ssn', value);
                    }}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('ssn') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="•••••••••"
                    maxLength={9}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.ssn && formData.ssn.length === 9 ? `Last 4 digits: ••••${formData.ssn.slice(-4)}` : 'Enter your 9-digit SSN'}
                  </p>
                </div>
              </div>

              {/* DOB Easy Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Date of Birth *
                  <AnimatedCheckmark fieldName="dateOfBirth" />
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <select
                      name="dobMonth"
                      value={formData.dobMonth || ''}
                      onChange={(e) => handleInputChange('dobMonth', e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        shakingFields.has('dateOfBirth') ? 'shake border-red-500' : ''
                      }`}
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <select
                      name="dobDay"
                      value={formData.dobDay || ''}
                      onChange={(e) => handleInputChange('dobDay', e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        shakingFields.has('dateOfBirth') ? 'shake border-red-500' : ''
                      }`}
                      required
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <select
                      name="dobYear"
                      value={formData.dobYear || ''}
                      onChange={(e) => handleInputChange('dobYear', e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        shakingFields.has('dateOfBirth') ? 'shake border-red-500' : ''
                      }`}
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {formData.dobMonth && formData.dobDay && formData.dobYear && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {new Date(parseInt(formData.dobYear), parseInt(formData.dobMonth) - 1, parseInt(formData.dobDay)).toLocaleDateString()}
                  </div>
                )}
                {invalidFields.has('dateOfBirth') && formData.dobMonth && formData.dobDay && formData.dobYear && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    You must be 18 years or older to register
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Identity Verification</h3>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-emerald-900">Take a Selfie</h4>
                  <p className="text-sm text-emerald-700">Please take a clear selfie for identity verification</p>
                </div>
              </div>
              
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                invalidFields.has('selfie') 
                  ? 'border-red-500 bg-red-50 shake' 
                  : 'border-emerald-300 hover:border-emerald-400'
              }`}>
                {!formData.selfie ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Selfie</h5>
                      <p className="text-gray-600 text-sm mb-4">
                        Take a clear photo of yourself for identity verification
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            handleInputChange('selfie', e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="selfie-upload"
                    />
                    <label
                      htmlFor="selfie-upload"
                      className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Take Photo or Upload</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={formData.selfie}
                        alt="Uploaded Selfie"
                        className="mx-auto max-w-sm rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => {
                          handleInputChange('selfie', null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleInputChange('selfie', null);
                        }}
                        className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Retake Selfie</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Selfie Upload Validation Error */}
              {invalidFields.has('selfie') && (
                <div className="mt-4 flex items-center text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm">Please take a selfie for identity verification</span>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Local Address in {detectedCountry === 'CO' ? 'Colombia' : detectedCountry === 'DO' ? 'Dominican Republic' : 'Your Country'}
              </h4>
              <p className="text-sm text-gray-600 mb-4">Please provide your current local address where you are currently residing.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                    <AnimatedCheckmark fieldName="currentAddress" />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={(e) => {
                        handleInputChange('currentAddress', e.target.value);
                        fetchAddressSuggestions(e.target.value, 'currentAddress');
                      }}
                      onFocus={() => {
                        if (formData.currentAddress.length >= 3) {
                          fetchAddressSuggestions(formData.currentAddress, 'currentAddress');
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        shakingFields.has('currentAddress') ? 'shake border-red-500' : ''
                      }`}
                      placeholder="Start typing your address..."
                      required
                    />
                    
                    {/* Address suggestions dropdown */}
                    {showSuggestions && activeField === 'currentAddress' && addressSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleAddressSelect(suggestion.place_id, 'currentAddress')}
                            onMouseDown={(e) => e.preventDefault()}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{suggestion.structured_formatting.main_text}</div>
                            <div className="text-sm text-gray-600">{suggestion.structured_formatting.secondary_text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                    <AnimatedCheckmark fieldName="currentCity" />
                  </label>
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity}
                    onChange={(e) => handleInputChange('currentCity', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('currentCity') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                    <AnimatedCheckmark fieldName="currentState" />
                  </label>
                  <input
                    type="text"
                    name="currentState"
                    value={formData.currentState}
                    onChange={(e) => handleInputChange('currentState', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('currentState') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter state/province"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code *
                    <AnimatedCheckmark fieldName="currentZip" />
                  </label>
                  <input
                    type="text"
                    name="currentZip"
                    value={formData.currentZip}
                    onChange={(e) => handleInputChange('currentZip', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('currentZip') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter ZIP/postal code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                    <AnimatedCheckmark fieldName="currentCountry" />
                  </label>
                  <input
                    type="text"
                    name="currentCountry"
                    value={formData.currentCountry}
                    onChange={(e) => handleInputChange('currentCountry', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('currentCountry') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Registered with FMP Program</h4>
              <p className="text-sm text-gray-600 mb-4">Please provide the address you have registered with the FMP Program. This is usually a US address.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FMP Street Address *
                    <AnimatedCheckmark fieldName="fmpAddress" />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fmpAddress"
                      value={formData.fmpAddress}
                      onChange={(e) => {
                        handleInputChange('fmpAddress', e.target.value);
                        fetchAddressSuggestions(e.target.value, 'fmpAddress');
                      }}
                      onFocus={() => {
                        if (formData.fmpAddress.length >= 3) {
                          fetchAddressSuggestions(formData.fmpAddress, 'fmpAddress');
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                        shakingFields.has('fmpAddress') ? 'shake border-red-500' : ''
                      }`}
                      placeholder="Start typing your FMP address..."
                      required
                    />
                    
                    {/* Address suggestions dropdown */}
                    {showSuggestions && activeField === 'fmpAddress' && addressSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleAddressSelect(suggestion.place_id, 'fmpAddress')}
                            onMouseDown={(e) => e.preventDefault()}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{suggestion.structured_formatting.main_text}</div>
                            <div className="text-sm text-gray-600">{suggestion.structured_formatting.secondary_text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FMP City *
                    <AnimatedCheckmark fieldName="fmpCity" />
                  </label>
                  <input
                    type="text"
                    name="fmpCity"
                    value={formData.fmpCity}
                    onChange={(e) => handleInputChange('fmpCity', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('fmpCity') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FMP State *
                    <AnimatedCheckmark fieldName="fmpState" />
                  </label>
                  <input
                    type="text"
                    name="fmpState"
                    value={formData.fmpState}
                    onChange={(e) => handleInputChange('fmpState', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('fmpState') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FMP ZIP Code *
                    <AnimatedCheckmark fieldName="fmpZip" />
                  </label>
                  <input
                    type="text"
                    name="fmpZip"
                    value={formData.fmpZip}
                    onChange={(e) => handleInputChange('fmpZip', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('fmpZip') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FMP Country *
                    <AnimatedCheckmark fieldName="fmpCountry" />
                  </label>
                  <input
                    type="text"
                    name="fmpCountry"
                    value={formData.fmpCountry}
                    onChange={(e) => handleInputChange('fmpCountry', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('fmpCountry') ? 'shake border-red-500' : ''
                    }`}
                    placeholder="Enter country (usually USA)"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                    <AnimatedCheckmark fieldName="emergencyContactName" />
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('emergencyContactName') ? 'shake border-red-500' : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                    <AnimatedCheckmark fieldName="emergencyContactPhone" />
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('emergencyContactPhone') ? 'shake border-red-500' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Medical Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications *
                <AnimatedCheckmark fieldName="medications" />
              </label>
              <div className="space-y-3">
                <div className={`flex gap-2 ${shakingFields.has('medications') ? 'shake' : ''}`}>
                  <input
                    type="text"
                    value={formData.medicationInput}
                    onChange={(e) => handleInputChange('medicationInput', e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (formData.medicationInput.trim()) {
                          const newMedications = [...(formData.medications || []), formData.medicationInput.trim()];
                          handleInputChange('medications', newMedications);
                          handleInputChange('medicationInput', '');
                        }
                      }
                    }}
                    className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      shakingFields.has('medications') ? 'border-red-500' : ''
                    }`}
                    placeholder="Type medication name..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.medicationInput.trim()) {
                        const newMedications = [...(formData.medications || []), formData.medicationInput.trim()];
                        handleInputChange('medications', newMedications);
                        handleInputChange('medicationInput', '');
                      }
                    }}
                    disabled={!formData.medicationInput.trim()}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[60px]"
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>
                
                {/* Display medications as tags */}
                {formData.medications && formData.medications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.medications.map((medication, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {medication}
                        <button
                          type="button"
                          onClick={() => {
                            const newMedications = formData.medications.filter((_, i) => i !== index);
                            handleInputChange('medications', newMedications);
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Insurance Selection</h3>
            
            <div className="text-center mb-6">
              <p className="text-gray-600">Are you enrolled with any of the following insurances?</p>
              <p className="text-sm text-gray-500">Please select one option only</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
                  <p className="text-gray-700 font-medium">Loading insurances...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {insurances.map((insurance) => (
                  <label
                    key={insurance.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.selectedInsurance === insurance.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : invalidFields.has('selectedInsurance')
                        ? 'border-red-500 bg-red-50 shake'
                        : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="insurance"
                      value={insurance.id}
                      checked={formData.selectedInsurance === insurance.id}
                      onChange={(e) => handleInputChange('selectedInsurance', e.target.value)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{insurance.company}</div>
                      <div className="text-sm text-gray-500">Code: {insurance.code}</div>
                    </div>
                    {formData.selectedInsurance === insurance.id && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </label>
                ))}
                
                {insurances.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No insurances available at the moment.</p>
                    <p className="text-sm">Please contact support for assistance.</p>
                  </div>
                )}
              </div>
            )}

            {/* Insurance Selection Validation Error */}
            {invalidFields.has('selectedInsurance') && (
              <div className="mt-4 flex items-center text-red-600">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm">Please select an insurance option</span>
              </div>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Disability Letter Upload</h3>
            
              <div className="text-center mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                Do you have your disability letter handy? *
                <AnimatedCheckmark fieldName="hasDisabilityLetter" />
              </h4>
              <div className={`flex justify-center space-x-8 ${
                invalidFields.has('hasDisabilityLetter') ? 'shake' : ''
              }`}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasDisabilityLetter"
                    checked={formData.hasDisabilityLetter === true}
                    onChange={() => handleInputChange('hasDisabilityLetter', true)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 text-lg font-medium">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasDisabilityLetter"
                    checked={formData.hasDisabilityLetter === false}
                    onChange={() => handleInputChange('hasDisabilityLetter', false)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 text-lg font-medium">No</span>
                </label>
              </div>
            </div>

            {/* Upload section for "Yes" */}
            {formData.hasDisabilityLetter === true && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Upload Disability Letter
                </h4>
                <p className="text-sm text-emerald-700 mb-4">
                  Please upload a clear photo or scan of your disability letter.
                </p>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  invalidFields.has('disabilityLetter') 
                    ? 'border-red-500 bg-red-50 shake' 
                    : 'border-emerald-300 bg-white'
                }`}>
                  {formData.disabilityLetter ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-12 h-12 text-emerald-600" />
                      </div>
                      <p className="text-sm text-emerald-700">Disability letter uploaded</p>
                      <button
                        type="button"
                        onClick={() => handleInputChange('disabilityLetter', null)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  handleInputChange('disabilityLetter', e.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <span className="inline-flex items-center px-4 py-2 border border-emerald-300 rounded-md shadow-sm text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        );


      case 10:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Patient Consent and Signature</h3>
            
            {/* Patient Consent Text */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Consent</h4>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  <strong>PATIENT CONSENT FOR TREATMENT</strong>
                </p>
                
                <p>
                  I voluntarily consent for and authorize as my medical provider, his/her assistants or designees (collectively called "the physicians") may deem necessary or advisable. This care may include, but is not limited to, routine diagnostics, radiology and laboratory procedures, administration of routine drugs, biologics and other therapeutics, and routine medical and nursing care. I authorize my physician(s) to perform other additional or extended services in emergency situations if it may be necessary or advisable in order to preserve my life or health. I understand that my (the patient) care is directed by my physician(s) and that other personnel render care and services to me (the patient) according to the physician(s) instructions.
                </p>
                
                <p>
                  I acknowledge that no guarantees or promises have been made to me with respect to results of such diagnostic procedure or treatment.
                </p>
                
                <p>
                  I am aware that I may stop treatment at any time.
                </p>
                
                <p>
                  I am aware that if I am paying for services "out of pocket," I am responsible for all balances due.
                </p>
                
                <p>
                  By signing below, I agree that I have been fully oriented to the treatment that is being provided to me. I have reviewed my rights and responsibilities as a client and I am aware of the grievance process and the discharge/termination policy of this agency.
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                Patient Signature
                <AnimatedCheckmark fieldName="patientSignature" />
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  SIGNATURE *
                  <AnimatedCheckmark fieldName="patientSignature" />
                </label>
                <div className={`border-2 rounded-lg bg-white ${
                  invalidFields.has('patientSignature') 
                    ? 'border-red-500 bg-red-50 shake' 
                    : 'border-gray-300'
                }`}>
                  <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{
                      className: 'w-full h-32 border-0 rounded-lg'
                    }}
                    onEnd={handleSignatureEnd}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Signature
                  </button>
                  <p className="text-sm text-gray-600">
                    <strong>Signed by:</strong> {formData.firstName} {formData.lastName}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  By selecting Accept and Submit below, I Agree that the signature will be the electronic representation of my signature for all purposes when I use them on documents - just the same as a pen-and-paper signature.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleInputChange('consentAccepted', !formData.consentAccepted)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      invalidFields.has('consentAccepted') ? 'shake' : ''
                    } ${
                      formData.consentAccepted 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {formData.consentAccepted ? 'Consent Accepted ✓' : 'Accept Consent'}
                    <AnimatedCheckmark fieldName="consentAccepted" />
                  </button>
                </div>
                
              </div>
            </div>

            {/* Signature and Consent Validation Errors */}
            {invalidFields.has('patientSignature') && (
              <div className="mt-4 flex items-center text-red-600">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm">Please provide your signature</span>
              </div>
            )}
            {invalidFields.has('consentAccepted') && (
              <div className="mt-4 flex items-center text-red-600">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm">Please accept the consent terms</span>
              </div>
            )}
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

        {/* Progress Steps - Scrollable */}
        <div className="mb-8">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-4 sm:space-x-6 min-w-max px-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div 
                        onClick={() => goToStep(step.id)}
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                          isActive 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                            : isCompleted 
                              ? 'bg-emerald-100 border-emerald-600 text-emerald-600 hover:bg-emerald-200 shadow-md' 
                              : currentStep >= step.id - 1
                                ? 'bg-white border-gray-300 text-gray-400 hover:bg-gray-50 hover:border-gray-400'
                                : 'bg-white border-gray-300 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                          isActive ? 'text-emerald-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-6 sm:w-8 h-px mx-2 ${
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border ${
            toast.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
