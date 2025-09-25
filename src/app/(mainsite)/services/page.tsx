'use client';

import Link from 'next/link';
import { 
  Stethoscope, 
  Shield, 
  Globe, 
  Users, 
  Heart, 
  FileText, 
  Phone, 
  MapPin,
  CheckCircle,
  ArrowRight,
  Star,
  Building2
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Stethoscope,
      title: "Patient Registration",
      description: "Complete digital registration with secure data collection including personal info, medical history, and identity verification.",
      features: ["Multi-step form wizard", "Secure data encryption", "Real-time validation", "Mobile responsive"],
      link: "/patient-registration"
    },
    {
      icon: Shield,
      title: "Identity Verification",
      description: "Advanced identity verification system with selfie capture, digital signatures, and document validation.",
      features: ["Biometric verification", "Document scanning", "Digital signatures", "HIPAA compliant"],
      link: "#"
    },
    {
      icon: Globe,
      title: "International Facilities",
      description: "Access to premium healthcare facilities in Colombia and Dominican Republic with seamless coordination.",
      features: ["Colombia facilities", "Dominican Republic access", "Facility coordination", "Global network"],
      link: "#"
    },
    {
      icon: Users,
      title: "Veteran Services",
      description: "Specialized healthcare services for all military branches with dedicated support and recognition.",
      features: ["All 6 military branches", "Specialized care", "Veteran recognition", "Priority support"],
      link: "#"
    },
    {
      icon: Heart,
      title: "Medical Records",
      description: "Comprehensive medical data collection including vitals, pain assessment, allergies, and medications.",
      features: ["Vitals tracking", "Pain scale assessment", "Allergy management", "Medication records"],
      link: "#"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Secure document upload and management system for disability letters and medical documentation.",
      features: ["Document upload", "Secure storage", "Easy access", "Compliance ready"],
      link: "#"
    }
  ];

  const branches = ["Army", "Marine Corps", "Navy", "Air Force", "Space Force", "Coast Guard"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(5, 150, 105, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(13, 148, 136, 0.1) 0%, transparent 50%)`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Our Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive healthcare solutions designed to provide 
              <span className="font-semibold text-emerald-600"> VIP-level service</span> and 
              <span className="font-semibold text-teal-600"> international access</span>
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={service.link}
                  className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 group-hover:translate-x-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Veteran Recognition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the difference of premium healthcare services. 
              Start your registration today and join thousands of satisfied patients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/patient-registration"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Start Registration</span>
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

export default Services;
