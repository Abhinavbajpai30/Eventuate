import React from 'react';
import {
  Rating
} from '@mui/material';
import { 
  LocationOn, 
  CalendarToday, 
  Person, 
  Group
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
        {/* Event Image */}
        <div 
          className="h-48 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          {/* Price Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
              event.isFree ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {formatPrice(event.price)}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
          </div>
        </div>

        <div className="flex-grow p-6">
          {/* Event Title */}
          <h3 className="text-xl font-semibold mb-4 leading-tight text-gray-800">
            {event.title}
          </h3>

          {/* Event Details */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center text-gray-600">
              <CalendarToday className="text-gray-400 mr-2 text-sm" />
              <span className="text-sm">
                {formatDate(event.date)} • {event.time}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <LocationOn className="text-gray-400 mr-2 text-sm" />
              <span className="text-sm">{event.location}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Person className="text-gray-400 mr-2 text-sm" />
              <span className="text-sm">{event.organizer}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Group className="text-gray-400 mr-2 text-sm" />
              <span className="text-sm">{event.attendees} attending</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <Rating
              value={4.5}
              readOnly
              size="small"
              className="mr-2"
            />
            <span className="text-sm text-gray-600">
              4.5 (128 reviews)
            </span>
          </div>

          {/* Price and CTA */}
          <div className="flex justify-between items-center">
            <span className={`text-xl font-bold ${
              event.isFree ? 'text-green-500' : 'text-blue-500'
            }`}>
              {formatPrice(event.price)}
            </span>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                Book Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard; 