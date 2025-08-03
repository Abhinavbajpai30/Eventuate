const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/events
// @desc    Browse events with filters
// @access  Public
router.get('/', [
  query('category').optional().isIn(['Music', 'Food & Drink', 'Workshops', 'Networking', 'Sports', 'Arts', 'Technology', 'Fitness']),
  query('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('priceMin').optional().isNumeric(),
  query('priceMax').optional().isNumeric(),
  query('location').optional().isString(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      category,
      status = 'published',
      dateFrom,
      dateTo,
      priceMin,
      priceMax,
      location,
      search,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { status };

    if (category) filter.category = category;
    if (dateFrom || dateTo) {
      filter.dateTime = {};
      if (dateFrom) filter.dateTime.$gte = new Date(dateFrom);
      if (dateTo) filter.dateTime.$lte = new Date(dateTo);
    }
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.venue': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'name email')
        .sort({ dateTime: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Event.countDocuments(filter)
    ]);

    // Get booking counts for each event
    const eventsWithBookings = await Promise.all(
      events.map(async (event) => {
        const bookingCount = await Booking.countDocuments({ 
          event: event._id, 
          status: 'confirmed' 
        });
        return {
          ...event,
          bookingCount,
          availableSpots: Math.max(0, event.capacity - bookingCount)
        };
      })
    );

    res.json({
      events: eventsWithBookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event (organizer only)
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').isIn(['Music', 'Food & Drink', 'Workshops', 'Networking', 'Sports', 'Arts', 'Technology', 'Fitness']).withMessage('Invalid category'),
  body('dateTime').isISO8601().withMessage('Invalid date format'),
  body('location.venue').trim().notEmpty().withMessage('Venue is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is organizer
    if (!['organizer', 'both'].includes(req.user.accountType)) {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }

    const {
      title,
      description,
      category,
      dateTime,
      location,
      price,
      capacity,
      images = [],
      tags = []
    } = req.body;

    const event = new Event({
      title,
      description,
      organizer: req.user.id,
      category,
      dateTime,
      location,
      price,
      capacity,
      images,
      tags
    });

    await event.save();

    // Populate organizer info
    await event.populate('organizer', 'name email');

    res.status(201).json({
      message: 'Event created successfully',
      event: event.toEventJSON()
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email phone')
      .lean();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get booking count
    const bookingCount = await Booking.countDocuments({ 
      event: event._id, 
      status: 'confirmed' 
    });

    const eventWithBookings = {
      ...event,
      bookingCount,
      availableSpots: Math.max(0, event.capacity - bookingCount)
    };

    res.json(eventWithBookings);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (organizer only)
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category').optional().isIn(['Music', 'Food & Drink', 'Workshops', 'Networking', 'Sports', 'Arts', 'Technology', 'Fitness']).withMessage('Invalid category'),
  body('dateTime').optional().isISO8601().withMessage('Invalid date format'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update event
    Object.keys(req.body).forEach(key => {
      if (key === 'location') {
        event.location = { ...event.location, ...req.body.location };
      } else {
        event[key] = req.body[key];
      }
    });

    await event.save();
    await event.populate('organizer', 'name email');

    res.json({
      message: 'Event updated successfully',
      event: event.toEventJSON()
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (organizer only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Check if event has bookings
    const bookingCount = await Booking.countDocuments({ event: event._id });
    if (bookingCount > 0) {
      return res.status(400).json({ message: 'Cannot delete event with existing bookings' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/organizer/my-events
// @desc    Get organizer's events
// @access  Private
router.get('/organizer/my-events', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { organizer: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Event.countDocuments(filter)
    ]);

    // Get booking counts for each event
    const eventsWithBookings = await Promise.all(
      events.map(async (event) => {
        const bookingCount = await Booking.countDocuments({ 
          event: event._id, 
          status: 'confirmed' 
        });
        return {
          ...event,
          bookingCount,
          availableSpots: Math.max(0, event.capacity - bookingCount)
        };
      })
    );

    res.json({
      events: eventsWithBookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 