const express = require('express');
const { body, validationResult, query } = require('express-validator');
const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

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

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    if (new Date(event.dateTime) <= new Date()) {
      return res.status(400).json({ message: 'Cannot book past events' });
    }

    const existingBooking = await Booking.findOne({
      event: eventId,
      attendee: req.user.id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking for this event' });
    }

    const confirmedBookings = await Booking.countDocuments({
      event: eventId,
      status: 'confirmed'
    });

    if (confirmedBookings + ticketCount > event.capacity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalAmount = event.price * ticketCount;

    const booking = new Booking({
      event: eventId,
      attendee: req.user.id,
      ticketCount,
      totalAmount,
      specialRequests
    });

    await booking.save();

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

router.get('/events/:eventId/bookings', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

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

router.put('/:id', auth, [
  body('status').optional().isIn(['confirmed', 'pending', 'cancelled']).withMessage('Invalid status'),
  body('checkInStatus').optional().custom((value) => {
    if (value !== undefined && typeof value !== 'boolean') {
      throw new Error('Check-in status must be a boolean');
    }
    return true;
  })
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

    const isOrganizer = booking.event.organizer.toString() === req.user.id;
    const isAttendee = booking.attendee._id.toString() === req.user.id;

    if (!isOrganizer && !isAttendee) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    if (status && !isOrganizer) {
      return res.status(403).json({ message: 'Only organizers can change booking status' });
    }

    
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

router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'title dateTime location price images category organizer')
      .populate('attendee', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'dateTime');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.attendee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    
    if (new Date(booking.event.dateTime) <= new Date()) {
      return res.status(400).json({ message: 'Cannot cancel booking for past events' });
    }

    
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/qr', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'title dateTime location organizer')
      .populate('attendee', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    const isOrganizer = booking.event.organizer.toString() === req.user.id;
    const isAttendee = booking.attendee._id.toString() === req.user.id;

    if (!isOrganizer && !isAttendee) {
      return res.status(403).json({ message: 'Not authorized to access this QR code' });
    }

    
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'QR code only available for confirmed bookings' });
    }

    
    const qrData = {
      bookingId: booking._id,
      eventId: booking.event._id,
      attendeeId: booking.attendee._id,
      attendeeName: booking.attendee.name,
      eventTitle: booking.event.title,
      ticketCount: booking.ticketCount,
      timestamp: new Date().toISOString()
    };

    
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      qrCode: qrCodeDataURL,
      booking: booking.toBookingJSON()
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/qr/verify', auth, [
  body('qrData').notEmpty().withMessage('QR data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { qrData } = req.body;
    let parsedData;

    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }

    const { bookingId, eventId } = parsedData;

    if (!bookingId || !eventId) {
      return res.status(400).json({ message: 'Invalid QR code data' });
    }

    
    const booking = await Booking.findById(bookingId)
      .populate('event', 'title dateTime location organizer')
      .populate('attendee', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.event._id.toString() !== eventId) {
      return res.status(400).json({ message: 'QR code does not match event' });
    }


    if (booking.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only event organizers can scan QR codes' });
    }

    
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Booking is not confirmed' });
    }

    
    if (booking.checkInStatus) {
      return res.status(400).json({ 
        message: 'Attendee already checked in',
        booking: booking.toBookingJSON(),
        alreadyCheckedIn: true
      });
    }

    
    booking.checkInStatus = true;
    booking.checkInTime = new Date();
    await booking.save();

    res.json({
      message: 'Attendee checked in successfully',
      booking: booking.toBookingJSON(),
      attendee: {
        name: booking.attendee.name,
        email: booking.attendee.email,
        phone: booking.attendee.phone,
        ticketCount: booking.ticketCount,
        totalAmount: booking.totalAmount,
        specialRequests: booking.specialRequests
      }
    });
  } catch (error) {
    console.error('Verify QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 