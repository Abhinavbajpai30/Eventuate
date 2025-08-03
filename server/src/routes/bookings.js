const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/bookings
// @desc    Book an event
// @access  Private
router.post('/', auth, [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('ticketCount').isInt({ min: 1 }).withMessage('At least 1 ticket is required'),
  body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, ticketCount, specialRequests } = req.body;

    // Check if event exists and is published
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    // Check if event is in the future
    if (new Date(event.dateTime) <= new Date()) {
      return res.status(400).json({ message: 'Cannot book past events' });
    }

    // Check if user already has a booking for this event
    const existingBooking = await Booking.findOne({
      event: eventId,
      attendee: req.user.id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this event' });
    }

    // Check capacity
    const confirmedBookings = await Booking.countDocuments({
      event: eventId,
      status: 'confirmed'
    });

    if (confirmedBookings + ticketCount > event.capacity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Calculate total amount
    const totalAmount = event.price * ticketCount;

    // Create booking
    const booking = new Booking({
      event: eventId,
      attendee: req.user.id,
      ticketCount,
      totalAmount,
      specialRequests
    });

    await booking.save();

    // Populate event and attendee info
    await booking.populate([
      { path: 'event', select: 'title dateTime location price' },
      { path: 'attendee', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: booking.toBookingJSON()
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { attendee: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('event', 'title dateTime location price images category')
        .populate('attendee', 'name email')
        .sort({ bookingDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Booking.countDocuments(filter)
    ]);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id/bookings
// @desc    Get event bookings (organizer only)
// @access  Private
router.get('/events/:eventId/bookings', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // Check if event exists and user is the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view event bookings' });
    }

    const filter = { event: eventId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('attendee', 'name email phone')
        .sort({ bookingDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Booking.countDocuments(filter)
    ]);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get event bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private
router.put('/:id', auth, [
  body('status').isIn(['confirmed', 'pending', 'cancelled']).withMessage('Invalid status'),
  body('checkInStatus').optional().isBoolean().withMessage('Check-in status must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, checkInStatus } = req.body;

    const booking = await Booking.findById(id)
      .populate('event', 'organizer title')
      .populate('attendee', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isOrganizer = booking.event.organizer.toString() === req.user.id;
    const isAttendee = booking.attendee._id.toString() === req.user.id;

    if (!isOrganizer && !isAttendee) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Only organizers can change status to confirmed/cancelled
    if (status && !isOrganizer) {
      return res.status(403).json({ message: 'Only organizers can change booking status' });
    }

    // Update booking
    if (status) booking.status = status;
    if (checkInStatus !== undefined) {
      booking.checkInStatus = checkInStatus;
      if (checkInStatus) {
        booking.checkInTime = new Date();
      }
    }

    await booking.save();

    res.json({
      message: 'Booking updated successfully',
      booking: booking.toBookingJSON()
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'title dateTime location price images category organizer')
      .populate('attendee', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isOrganizer = booking.event.organizer.toString() === req.user.id;
    const isAttendee = booking.attendee._id.toString() === req.user.id;

    if (!isOrganizer && !isAttendee) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking (attendee only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'dateTime');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only attendees can cancel their own bookings
    if (booking.attendee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if event is in the future
    if (new Date(booking.event.dateTime) <= new Date()) {
      return res.status(400).json({ message: 'Cannot cancel booking for past events' });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/analytics/event/:eventId
// @desc    Get booking analytics for an event (organizer only)
// @access  Private
router.get('/analytics/event/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists and user is the organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view event analytics' });
    }

    // Get booking statistics
    const stats = await Booking.getBookingStats(eventId);

    // Get booking trends over time
    const bookingTrends = await Booking.aggregate([
      { $match: { event: event._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$bookingDate" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      event: {
        id: event._id,
        title: event.title,
        capacity: event.capacity,
        price: event.price
      },
      stats,
      bookingTrends
    });
  } catch (error) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 