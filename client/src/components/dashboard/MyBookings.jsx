import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as PendingIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [downloadingTickets, setDownloadingTickets] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/bookings/${bookingId}`);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const handleViewQRCode = async (booking) => {
    try {
      setQrLoading(true);
      setSelectedBooking(booking);
      setQrModalOpen(true);
      
      const response = await axios.get(`http://localhost:4000/api/bookings/${booking._id}/qr`);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
      setQrModalOpen(false);
    } finally {
      setQrLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode || !selectedBooking) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `ticket-${selectedBooking.event.title}-${selectedBooking._id}.png`;
    link.click();
  };

  const handleDownloadTicket = async (booking) => {
    try {
      setDownloadingTickets(prev => ({ ...prev, [booking._id]: true }));
      
      const response = await axios.get(`http://localhost:4000/api/bookings/${booking._id}/qr`);
      
      const link = document.createElement('a');
      link.href = response.data.qrCode;
      link.download = `ticket-${booking.event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${booking._id}.png`;
      link.click();
      
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket. Please try again.');
    } finally {
      setDownloadingTickets(prev => ({ ...prev, [booking._id]: false }));
    }
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
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {booking.event.images && booking.event.images.length > 0 ? (
          <img
            src={booking.event.images[0]}
            alt={booking.event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl">
            🎉
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            booking.totalAmount === 0 ? 'bg-green-500' : 'bg-blue-500'
          } text-white`}>
            {booking.totalAmount === 0 ? 'Free' : `₹${booking.totalAmount}`}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {booking.event.category}
          </span>
          <div className="flex items-center gap-2">
            {getStatusIcon(booking.status)}
            <span className="text-sm font-medium capitalize">{booking.status}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {booking.event.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {formatDate(booking.event.dateTime)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <LocationIcon className="h-4 w-4 mr-2" />
            {booking.event.location.venue}, {booking.event.location.city}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <PersonIcon className="h-4 w-4 mr-2" />
            {booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-lg mr-2">₹</span>
            Total: ₹{booking.totalAmount}
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {booking.status === 'confirmed' && (
              <>
                <button 
                  onClick={() => handleViewQRCode(booking)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <QrCodeIcon className="h-3 w-3" />
                  View QR Code
                </button>
                <button 
                  onClick={() => handleDownloadTicket(booking)}
                  disabled={downloadingTickets[booking._id]}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {downloadingTickets[booking._id] ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-green-700"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="h-3 w-3" />
                      Download Ticket
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          
          {booking.status === 'confirmed' && (
            <button
              onClick={() => handleCancelBooking(booking._id)}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Cancel Booking
            </button>
          )}
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
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage and track all your event bookings</p>
        </div>
      </div>

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
              ? 'Start exploring events and make your first booking!'
              : `You don't have any ${filter} bookings at the moment.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => window.location.href = '/dashboard/discover'}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Events
            </button>
          )}
        </div>
      )}

      {qrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Ticket QR Code</h3>
              
              {selectedBooking && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800">{selectedBooking.event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(selectedBooking.event.dateTime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.event.location.venue}, {selectedBooking.event.location.city}
                  </p>
                </div>
              )}

              {qrLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : qrCode ? (
                <div className="mb-6">
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="mx-auto border rounded-lg"
                    style={{ width: '256px', height: '256px' }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Show this QR code at the event entrance
                  </p>
                </div>
              ) : null}

              <div className="flex gap-3 justify-center">
                {qrCode && (
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download QR Code
                  </button>
                )}
                <button
                  onClick={() => {
                    setQrModalOpen(false);
                    setQrCode('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 