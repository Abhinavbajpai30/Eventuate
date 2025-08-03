import React from 'react';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import { featuredEvents } from '../data/mockData';

const FeaturedEvents = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Trending Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the most popular events happening this week. From music festivals to tech meetups, 
              find your next unforgettable experience.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center mx-auto">
                View All Events
                <ArrowForward className="ml-2" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents; 