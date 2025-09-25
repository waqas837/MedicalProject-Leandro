'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Stethoscope, User, Phone, MapPin, Building2 } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 shadow-2xl border-b border-emerald-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Logo</h1>
              <p className="text-emerald-200 text-sm">Premium Healthcare Services</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-emerald-200 transition-colors duration-300 font-medium flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Patient Portal</span>
            </Link>
            <Link 
              href="/patient-registration" 
              className="text-white hover:text-emerald-200 transition-colors duration-300 font-medium flex items-center space-x-2"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Register</span>
            </Link>
            <Link 
              href="/services" 
              className="text-white hover:text-emerald-200 transition-colors duration-300 font-medium flex items-center space-x-2"
            >
              <Building2 className="h-4 w-4" />
              <span>Services</span>
            </Link>
            <Link 
              href="/contact" 
              className="text-white hover:text-emerald-200 transition-colors duration-300 font-medium flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </Link>
            <Link 
              href="/about" 
              className="text-white hover:text-emerald-200 transition-colors duration-300 font-medium flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>About</span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-emerald-200 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-emerald-900/50 backdrop-blur-sm rounded-lg mt-2 border border-emerald-700/30">
              <Link 
                href="/" 
                className="block px-3 py-2 text-white hover:text-emerald-200 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Patient Portal
              </Link>
              <Link 
                href="/patient-registration" 
                className="block px-3 py-2 text-white hover:text-emerald-200 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link 
                href="/services" 
                className="block px-3 py-2 text-white hover:text-emerald-200 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-white hover:text-emerald-200 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-white hover:text-emerald-200 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-emerald-700/30 pt-2 mt-2">
                <Link 
                  href="/contact" 
                  className="block px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold transition-all duration-300 mx-3 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
