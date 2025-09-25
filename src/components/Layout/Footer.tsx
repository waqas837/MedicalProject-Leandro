'use client';

import Link from 'next/link';
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Shield,
  Globe
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Logo</h3>
                <p className="text-emerald-200 text-sm">Premium Healthcare</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Providing world-class healthcare services with VIP-level attention to detail and international facility access.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/patient-registration" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/patient-registration" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Medical Records
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Veteran Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  International Care
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Emergency Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">info@Logo.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Global Network</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">International Coverage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Made with care for your health and wellbeing</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Disclaimer
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Refund Policy
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">
            <p>&copy; 2024 Logo. All rights reserved. Premium Healthcare Services.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
