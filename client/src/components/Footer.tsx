import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold mb-4">Eventuate</h3>
          <p className="text-gray-400">
            Your unified platform for event management, collaboration, and
            discovery.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2">
              <a href="#features" className="text-gray-400 hover:text-white">Features</a>
            </li>
            <li className="mb-2">
              <a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a>
            </li>
            <li className="mb-2">
              <a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a>
            </li>
            <li className="mb-2">
              <a href="#events" className="text-gray-400 hover:text-white">Trending Events</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-400 mb-2">Email: info@eventuate.com</p>
          <p className="text-gray-400 mb-2">Phone: +91 98765 43210</p>
          <p className="text-gray-400">Address: Rishihood University</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Legal & Social</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            </li>
          </ul>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        <p>&copy; 2025 Eventuate. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
