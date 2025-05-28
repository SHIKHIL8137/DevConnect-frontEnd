import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white py-8 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
          <div className="space-y-4 md:w-1/4">
            <div className="flex items-center">
              <span className="text-blue-500 text-2xl font-bold">
                &lt; &gt; Dev
              </span>
              <span className="text-gray-400 text-2xl font-bold">Connect</span>
            </div>
            <p className="text-gray-700">
              Powerful Freelance Marketplace System with ability to change the
              Users (Freelancers & Clients)
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-500">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-500">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-500">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-500">
                  Find Freelancers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-500">
                  Post Project
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-500">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-500">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              For Freelancers
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-500">
                  Find Work
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-500">
                  Create Account
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin size={18} className="text-gray-700" />
                <span className="text-gray-700">Thrissur</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-gray-700" />
                <span className="text-gray-700">+918137046575</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-gray-700" />
                <span className="text-gray-700">devconnect@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-500">
          <p>2025 DevConnect. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
