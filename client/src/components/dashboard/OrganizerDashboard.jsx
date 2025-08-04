import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Event as EventIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOrganizer = user?.accountType === 'organizer' || user?.accountType === 'both';

  useEffect(() => {
    if (isOrganizer) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isOrganizer]);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/organizer/my-events?limit=5`);
      
      const events = eventsRes.data.events;
      const totalEvents = events.length;
      const totalBookings = events.reduce((sum, event) => sum + (event.bookingCount || 0), 0);
      const totalRevenue = events.reduce((sum, event) => sum + ((event.bookingCount || 0) * event.price), 0);
      
      setStats({
        totalEvents,
        totalBookings,
        totalRevenue,
        averageRating: 4.5 
      });

      setRecentEvents(events);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {new Date(event.dateTime).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <LocationIcon className="h-4 w-4 mr-2" />
            {event.location.city}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              event.status === 'published' ? 'bg-green-100 text-green-800' :
              event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {event.status}
            </span>
            <span className="text-gray-600">
              {event.bookingCount || 0} bookings
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600">₹{event.price}</p>
          <p className="text-sm text-gray-500">{event.availableSpots} spots left</p>
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

  if (!isOrganizer) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <EventIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizer Dashboard</h3>
          <p className="text-gray-600 mb-4">
            This dashboard is for event organizers. Switch to attendee view to browse events.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/discover'}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Here's what's happening with your events today.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={EventIcon}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={PeopleIcon}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={MoneyIcon}
          color="bg-purple-500"
          change={15}
        />
        <StatCard
          title="Avg Rating"
          value={stats.averageRating}
          icon={TrendingIcon}
          color="bg-orange-500"
          change={5}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Create Event"
            description="Start organizing a new event"
            icon={AddIcon}
            color="bg-blue-500"
            onClick={() => window.location.href = '/dashboard/events/create'}
          />
          <QuickActionCard
            title="View Bookings"
            description="Manage event bookings and attendees"
            icon={PeopleIcon}
            color="bg-green-500"
            onClick={() => window.location.href = '/dashboard/bookings'}
          />

        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <a
            href="/dashboard/events"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all events →
          </a>
        </div>
        
        {recentEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <EventIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first event</p>
            <button
              onClick={() => window.location.href = '/dashboard/events/create'}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard; 