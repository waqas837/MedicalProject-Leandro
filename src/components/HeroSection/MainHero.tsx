'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Stethoscope,
  Building2,
  Globe
} from 'lucide-react';

const MainHero = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const requirements = {
    personal: [
      { icon: User, title: "Personal Information", items: ["Name", "Date of Birth", "Current Address", "FMP Registered Address"] },
      { icon: Shield, title: "Identity Verification", items: ["Patient ID (Name, DOB, Sex)", "Social Security Number", "Patient Selfie", "Digital Signature"] },
      { icon: Mail, title: "Contact Details", items: ["Email Address", "Cell Phone Number", "Emergency Contact"] }
    ],
    medical: [
      { icon: Heart, title: "Medical Information", items: ["Weight & Height", "Pain Level (1-9 Scale)", "Food & Drug Allergies", "Current Medications"] },
      { icon: FileText, title: "Documentation", items: ["Disability Letter from FMP", "Medical Records"] },
      { icon: Users, title: "Veteran Status", items: ["Veteran Status", "Branch of Service (if applicable)"] }
    ],
    facilities: [
      { icon: Building2, title: "Facility Locations", items: ["City-based Facilities", "Facility Names", "Facility Logos"] },
      { icon: Globe, title: "International Coverage", items: ["Colombia (CO)", "Dominican Republic (DR)", "Global Network"] }
    ]
  };

  const branches = ["Army", "Marine Corps", "Navy", "Air Force", "Space Force", "Coast Guard"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Premium Healthcare
                </span>
                <br />
                <span className="text-gray-800">Experience</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Streamlined patient registration and medical data collection with 
                <span className="font-semibold text-emerald-600"> VIP-level service</span> and 
                <span className="font-semibold text-teal-600"> international facility access</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link 
                href="/patient-registration"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Start Registration</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 flex items-center space-x-3"
              >
                <Building2 className="h-6 w-6" />
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="bg-emerald-100 rounded-full p-3 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Bank-level encryption for all personal and medical data</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="bg-teal-100 rounded-full p-3 w-fit mx-auto mb-4">
                  <Globe className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Network</h3>
                <p className="text-gray-600">Access to facilities in Colombia, Dominican Republic, and more</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Veteran Support</h3>
                <p className="text-gray-600">Specialized services for all military branches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What We <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Collect</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive data collection ensures the highest quality of care and seamless service delivery
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(requirements).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Information
            </button>
          ))}
        </div>

        {/* Requirements Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {requirements[activeTab as keyof typeof requirements].map((section, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2">
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center space-x-2 text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Military Branches */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Military Service Recognition</h3>
            <p className="text-emerald-100">We honor and support all branches of the United States Armed Forces</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {branches.map((branch, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-300" />
                <p className="font-semibold text-sm">{branch}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust us with their healthcare needs. 
              Experience the difference of premium medical services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/patient-registration"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Register Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="group bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center space-x-3"
              >
                <Phone className="h-6 w-6" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHero;
