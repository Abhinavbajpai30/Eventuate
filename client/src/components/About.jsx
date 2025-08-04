import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Eventuate</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Eventuate is a modern event discovery and booking platform that connects event organizers with attendees. 
              Our mission is to make event planning and discovery seamless, enjoyable, and accessible to everyone.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded with the vision of bringing people together through amazing events, Eventuate has grown from a simple 
              idea into a comprehensive platform that serves both event organizers and attendees. We believe that every event, 
              no matter how small, has the power to create meaningful connections and unforgettable experiences.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">For Attendees</h3>
                <ul className="text-blue-800 space-y-2">
                  <li>• Discover amazing events in your area</li>
                  <li>• Easy booking and ticket management</li>
                  <li>• Personalized event recommendations</li>
                  <li>• QR code tickets for seamless entry</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">For Organizers</h3>
                <ul className="text-purple-800 space-y-2">
                  <li>• Create and manage events easily</li>
                  <li>• Track bookings and attendee data</li>
                  <li>• QR code check-in system</li>
                  <li>• Analytics and insights</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Building connections through shared experiences</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">Using technology to enhance event experiences</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">Delivering the best possible user experience</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About; 