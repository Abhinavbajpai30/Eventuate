import React from 'react';
import { 
  Event, 
  People, 
  LocationOn, 
  Business 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { statistics } from '../data/mockData';

const StatCard = ({ icon: Icon, title, value, description }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }} 
    >
      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl mx-auto mb-6">
          <Icon />
        </div>

        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {value.toLocaleString()}
        </h2>

        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const TrustSection = () => {
  const stats = [
    {
      icon: Event,
      title: 'Events Listed',
      value: statistics.eventsListed,
      description: 'Amazing events waiting for you to discover'
    },
    {
      icon: People,
      title: 'Happy Attendees',
      value: statistics.happyAttendees,
      description: 'People who found their perfect events'
    },
    {
      icon: LocationOn,
      title: 'Cities Covered',
      value: statistics.cities,
      description: 'Cities where we help people connect'
    },
    {
      icon: Business,
      title: 'Event Organizers',
      value: statistics.organizers,
      description: 'Trusted organizers creating amazing experiences'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-blue-500 to-purple-600 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Join our growing community of event enthusiasts and organizers. 
              See why thousands of people choose Eventuate for their events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <StatCard {...stat} />
                </motion.div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection; 