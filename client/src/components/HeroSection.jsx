import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex items-center relative overflow-hidden pt-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Find your next unforgettable experience. From music festivals to tech meetups, 
                discover events that match your interests and connect with amazing people.
              </p>

              <div className="flex gap-6 flex-wrap">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:from-yellow-500 hover:to-orange-600">
                    Find Events
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200">
                    List Your Event
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
                <div 
                  className="h-96 rounded-xl relative bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop")'
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl" />
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/5 left-1/10 bg-white/90 rounded-full w-15 h-15 flex items-center justify-center text-2xl"
                  >
                    🎵
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-3/5 right-1/6 bg-white/90 rounded-full w-12 h-12 flex items-center justify-center text-xl"
                  >
                    🎨
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 