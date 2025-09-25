'use client';

import { 
  Heart, 
  Shield, 
  Globe, 
  Users, 
  Star, 
  CheckCircle,
  Stethoscope,
  Building2,
  Award,
  Target
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make is guided by what's best for our patients' health and wellbeing."
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "We maintain the highest standards of data protection and HIPAA compliance."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Providing healthcare access across international borders with seamless coordination."
    },
    {
      icon: Users,
      title: "Veteran Support",
      description: "Dedicated services and recognition for those who have served our country."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Patients Served" },
    { number: "50+", label: "International Facilities" },
    { number: "24/7", label: "Support Available" },
    { number: "100%", label: "HIPAA Compliant" }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      description: "Board-certified physician with 15+ years of experience in international healthcare."
    },
    {
      name: "Michael Chen",
      role: "Technology Director",
      description: "Expert in healthcare technology and data security with a focus on patient privacy."
    },
    {
      name: "Captain David Rodriguez",
      role: "Veteran Services Coordinator",
      description: "Retired military officer dedicated to serving fellow veterans' healthcare needs."
    }
  ];

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
                About MediConnect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Pioneering the future of healthcare with 
              <span className="font-semibold text-emerald-600"> premium services</span>, 
              <span className="font-semibold text-teal-600"> international access</span>, and 
              <span className="font-semibold text-emerald-600"> veteran support</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              At MediConnect, we believe that quality healthcare should be accessible, secure, and personalized. 
              Our mission is to bridge the gap between patients and premium healthcare services through innovative 
              technology and compassionate care.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We're committed to providing VIP-level healthcare experiences while maintaining the highest standards 
              of security, privacy, and international accessibility. Our specialized veteran services ensure that 
              those who have served our country receive the recognition and care they deserve.
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 rounded-full p-3">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Excellence in Healthcare</h3>
                <p className="text-gray-600">Setting new standards for patient care</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose MediConnect?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">International Network</h4>
                  <p className="text-gray-600">Access to facilities in Colombia, Dominican Republic, and beyond</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Veteran-Focused Care</h4>
                  <p className="text-gray-600">Specialized services for all military branches</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">HIPAA Compliant</h4>
                  <p className="text-gray-600">Bank-level security for all patient data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                  <p className="text-gray-600">Round-the-clock assistance and emergency care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide everything we do at MediConnect
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-3 w-fit mx-auto mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Our Impact</h3>
            <p className="text-emerald-100">Numbers that reflect our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals leading MediConnect's mission
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-4 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join the MediConnect Family</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the difference of premium healthcare services. 
              Start your journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/patient-registration"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Start Registration</span>
              </a>
              <a 
                href="/contact"
                className="group bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center space-x-3"
              >
                <Building2 className="h-6 w-6" />
                <span>Learn More</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
