import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as PendingIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  Message as MessageIcon,
  CheckCircle as CheckInIcon
} from '@mui/icons-material';
import axios from 'axios';

const ManageBookings = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventBookings(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/organizer/my-events`);
      setEvents(response.data.events);
      if (response.data.events.length > 0) {
        setSelectedEvent(response.data.events[0]._id);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventBookings = async (eventId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/events/${eventId}/bookings`);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching event bookings:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <PendingIcon className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <CancelIcon className="h-5 w-5 text-red-500" />;
      default:
        return <PendingIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, {
        status: newStatus
      });
      fetchEventBookings(selectedEvent); 
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleCheckIn = async (bookingId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, {
        checkInStatus: true
      });
      fetchEventBookings(selectedEvent); 
    } catch (error) {
      console.error('Error checking in attendee:', error);
      alert('Failed to check in attendee');
    }
  };

  const exportBookings = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Tickets', 'Total Amount', 'Status', 'Booking Date'],
      ...bookings.map(booking => [
        booking.attendee.name,
        booking.attendee.email,
        booking.attendee.phone || 'N/A',
        booking.ticketCount,
        `₹${booking.totalAmount}`,
        booking.status,
        new Date(booking.bookingDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${selectedEvent}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const BookingCard = ({ booking }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {booking.attendee.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.attendee.name}</h3>
            <p className="text-sm text-gray-600">{booking.attendee.email}</p>
            {booking.attendee.phone && (
              <p className="text-sm text-gray-600">{booking.attendee.phone}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(booking.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <PersonIcon className="h-4 w-4 mr-2" />
          {booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="text-lg mr-2">₹</span>
          Total: ₹{booking.totalAmount}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
        </div>
        {booking.checkInStatus && (
          <div className="flex items-center text-sm text-green-600">
            <CheckInIcon className="h-4 w-4 mr-2" />
            Checked in at {new Date(booking.checkInTime).toLocaleTimeString()}
          </div>
        )}
      </div>

      {booking.specialRequests && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Special Requests:</strong> {booking.specialRequests}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {booking.status === 'pending' && (
          <>
            <button
              onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Confirm
            </button>
            <button
              onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Reject
            </button>
          </>
        )}
        
        {booking.status === 'confirmed' && !booking.checkInStatus && (
          <button
            onClick={() => handleCheckIn(booking._id)}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Check In
          </button>
        )}
        
        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <MessageIcon className="h-4 w-4" />
        </button>
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

  if (events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600 mb-4">
            You need to create events first to manage bookings.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/events/create'}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage bookings for your events</p>
        </div>
        
        {selectedEvent && bookings.length > 0 && (
          <button
            onClick={exportBookings}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <DownloadIcon className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => setSelectedEvent(event._id)}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                selectedEvent === event._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{event.category}</p>
              <p className="text-sm text-gray-600">
                {event.bookingCount} bookings • {event.availableSpots} spots left
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'pending', label: 'Pending' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'No one has booked this event yet.'
                  : `You don't have any ${filter} bookings for this event.`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageBookings; 