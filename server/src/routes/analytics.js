const express = require('express');
const { query } = require('express-validator');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/analytics/organizer
// @desc    Get organizer analytics
// @access  Private
router.get('/organizer', auth, [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req, res) => {
  try {
    const { period = '30d', startDate, endDate } = req.query;

    // Check if user is organizer
    if (!['organizer', 'both'].includes(req.user.accountType)) {
      return res.status(403).json({ message: 'Only organizers can view analytics' });
    }

    // Calculate date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const now = new Date();
      let start;
      switch (period) {
        case '7d':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      dateFilter = {
        createdAt: { $gte: start, $lte: now }
      };
    }

    // Get events created by organizer
    const events = await Event.find({
      organizer: req.user.id,
      ...dateFilter
    }).lean();

    const eventIds = events.map(event => event._id);

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { event: { $in: eventIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get revenue trends
    const revenueTrends = await Booking.aggregate([
      { $match: { event: { $in: eventIds }, status: 'confirmed' } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Get category performance
    const categoryPerformance = await Event.aggregate([
      { $match: { organizer: req.user._id, ...dateFilter } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'event',
          as: 'bookings'
        }
      },
      {
        $group: {
          _id: '$category',
          eventCount: { $sum: 1 },
          totalBookings: { $sum: { $size: '$bookings' } },
          totalRevenue: {
            $sum: {
              $reduce: {
                input: '$bookings',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.totalAmount'] }
              }
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Calculate summary statistics
    const totalEvents = events.length;
    const totalBookings = bookingStats.reduce((sum, stat) => sum + stat.count, 0);
    const totalRevenue = bookingStats.reduce((sum, stat) => sum + stat.revenue, 0);
    const confirmedBookings = bookingStats.find(stat => stat._id === 'confirmed')?.count || 0;
    const confirmedRevenue = bookingStats.find(stat => stat._id === 'confirmed')?.revenue || 0;

    res.json({
      summary: {
        totalEvents,
        totalBookings,
        totalRevenue,
        confirmedBookings,
        confirmedRevenue,
        averageRevenuePerEvent: totalEvents > 0 ? totalRevenue / totalEvents : 0,
        averageBookingsPerEvent: totalEvents > 0 ? totalBookings / totalEvents : 0
      },
      bookingStats: bookingStats.reduce((acc, stat) => {
        acc[stat._id] = { count: stat.count, revenue: stat.revenue };
        return acc;
      }, {}),
      revenueTrends,
      categoryPerformance,
      events: events.map(event => ({
        id: event._id,
        title: event.title,
        category: event.category,
        status: event.status,
        dateTime: event.dateTime,
        price: event.price,
        capacity: event.capacity
      }))
    });
  } catch (error) {
    console.error('Get organizer analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/attendee
// @desc    Get attendee insights
// @access  Private
router.get('/attendee', auth, [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const { period = '90d' } = req.query;

    // Calculate date range
    const now = new Date();
    let start;
    switch (period) {
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    // Get user's bookings
    const bookings = await Booking.find({
      attendee: req.user.id,
      bookingDate: { $gte: start, $lte: now }
    })
    .populate('event', 'title category dateTime price location')
    .sort({ bookingDate: -1 })
    .lean();

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { attendee: req.user._id, bookingDate: { $gte: start, $lte: now } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get category preferences
    const categoryPreferences = await Booking.aggregate([
      { $match: { attendee: req.user._id, bookingDate: { $gte: start, $lte: now } } },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $group: {
          _id: '$event.category',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get spending trends
    const spendingTrends = await Booking.aggregate([
      { $match: { attendee: req.user._id, bookingDate: { $gte: start, $lte: now } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" }
          },
          spent: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Calculate summary statistics
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const confirmedBookings = bookingStats.find(stat => stat._id === 'confirmed')?.count || 0;
    const confirmedSpent = bookingStats.find(stat => stat._id === 'confirmed')?.totalSpent || 0;

    // Get upcoming events
    const upcomingEvents = bookings.filter(booking => 
      new Date(booking.event.dateTime) > now && booking.status === 'confirmed'
    );

    // Get past events
    const pastEvents = bookings.filter(booking => 
      new Date(booking.event.dateTime) <= now && booking.status === 'confirmed'
    );

    res.json({
      summary: {
        totalBookings,
        totalSpent,
        confirmedBookings,
        confirmedSpent,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        averageSpentPerBooking: totalBookings > 0 ? totalSpent / totalBookings : 0
      },
      bookingStats: bookingStats.reduce((acc, stat) => {
        acc[stat._id] = { count: stat.count, totalSpent: stat.totalSpent };
        return acc;
      }, {}),
      categoryPreferences,
      spendingTrends,
      upcomingEvents: upcomingEvents.map(booking => ({
        id: booking._id,
        event: booking.event,
        bookingDate: booking.bookingDate,
        ticketCount: booking.ticketCount,
        totalAmount: booking.totalAmount
      })),
      pastEvents: pastEvents.map(booking => ({
        id: booking._id,
        event: booking.event,
        bookingDate: booking.bookingDate,
        ticketCount: booking.ticketCount,
        totalAmount: booking.totalAmount
      }))
    });
  } catch (error) {
    console.error('Get attendee analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 