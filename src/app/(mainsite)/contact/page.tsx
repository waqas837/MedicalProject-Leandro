'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Globe,
  Shield
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "24/7 Emergency Support"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@mediconnect.com", "support@mediconnect.com"],
      description: "Response within 24 hours"
    },
    {
      icon: MapPin,
      title: "Locations",
      details: ["Global Network", "Colombia & Dominican Republic"],
      description: "International Facilities"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Fri: 8AM-8PM", "Sat-Sun: 9AM-5PM"],
      description: "Emergency: 24/7"
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
                Contact Us
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Get in touch with our healthcare team. We're here to provide 
              <span className="font-semibold text-emerald-600"> premium support</span> and 
              <span className="font-semibold text-teal-600"> personalized care</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our dedicated healthcare team is ready to assist you with any questions or concerns. 
                We provide 24/7 emergency support and respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{info.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-700 font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">{info.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Emergency Contact</h3>
              </div>
              <p className="text-lg font-bold mb-2">+1 (555) 911-HELP</p>
              <p className="text-red-100">Available 24/7 for medical emergencies</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
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
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="registration">Patient Registration</option>
                    <option value="veteran">Veteran Services</option>
                    <option value="international">International Facilities</option>
                    <option value="emergency">Emergency Support</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Please describe your inquiry or concern..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
              >
                <Send className="h-6 w-6" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-emerald-100 rounded-full p-4 w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
            <p className="text-gray-600">All communications are secure and confidential</p>
          </div>
          <div className="text-center">
            <div className="bg-teal-100 rounded-full p-4 w-fit mx-auto mb-4">
              <Globe className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Network</h3>
            <p className="text-gray-600">International facilities and support</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-fit mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock assistance available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
