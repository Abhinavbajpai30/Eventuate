import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Bookmark as BookmarkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const AttendeeDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState({});
  const [bookingError, setBookingError] = useState({});

  const categories = [
    'Music', 'Food & Drink', 'Workshops', 'Networking', 
    'Sports', 'Arts', 'Technology', 'Fitness'
  ];

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events?${params}`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      priceMin: '',
      priceMax: '',
      search: ''
    });
  };

  const handleBookEvent = async (eventId, eventTitle) => {
    setBookingLoading(prev => ({ ...prev, [eventId]: true }));
    setBookingError(prev => ({ ...prev, [eventId]: '' }));
    setBookingSuccess(prev => ({ ...prev, [eventId]: '' }));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        eventId: eventId,
        ticketCount: 1,
        specialRequests: ''
      });

      setBookingSuccess(prev => ({ 
        ...prev, 
        [eventId]: `Successfully booked ${eventTitle}!` 
      }));

      setTimeout(() => {
        fetchEvents();
        setBookingSuccess(prev => ({ ...prev, [eventId]: '' }));
      }, 3000);

    } catch (error) {
      let errorMessage = 'Failed to book event';
      
      if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setBookingError(prev => ({ 
        ...prev, 
        [eventId]: errorMessage 
      }));

      setTimeout(() => {
        setBookingError(prev => ({ ...prev, [eventId]: '' }));
      }, 5000);
    } finally {
      setBookingLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {event.images && event.images.length > 0 ? (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl">
            🎉
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.price === 0 ? 'bg-green-500' : 'bg-blue-500'
          } text-white`}>
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {event.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            {event.rating?.average || 4.5}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {new Date(event.dateTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <LocationIcon className="h-4 w-4 mr-2" />
            {event.location.venue}, {event.location.city}
          </div>
        </div>

        {bookingSuccess[event._id] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center"
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            {bookingSuccess[event._id]}
          </motion.div>
        )}

        {bookingError[event._id] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm"
          >
            {bookingError[event._id]}
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {event.bookingCount || 0} attending • {event.availableSpots} spots left
          </div>
          <button 
            onClick={() => handleBookEvent(event._id, event.title)}
            disabled={bookingLoading[event._id] || event.availableSpots <= 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              event.availableSpots <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : bookingLoading[event._id]
                ? 'bg-blue-400 text-white cursor-wait'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {bookingLoading[event._id] ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Booking...
              </div>
            ) : event.availableSpots <= 0 ? (
              'Sold Out'
            ) : (
              'Book Now'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const FilterSection = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: showFilters ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter city"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleFilterChange}
            placeholder="₹0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleFilterChange}
            placeholder="₹1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Clear all filters
        </button>
        <div className="text-sm text-gray-500">
          {events.length} events found
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
          <p className="text-gray-600 mt-2">Find amazing events happening around you</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FilterIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search events by title, description, or venue..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {showFilters && <FilterSection />}

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendeeDashboard; 