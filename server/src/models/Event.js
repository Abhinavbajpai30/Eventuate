const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Music', 'Food & Drink', 'Workshops', 'Networking', 'Sports', 'Arts', 'Technology', 'Fitness']
  },
  dateTime: {
    type: Date,
    required: [true, 'Event date and time is required']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  images: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ organizer: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ dateTime: 1, status: 1 });
eventSchema.index({ location: 'text', title: 'text', description: 'text' });

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
  return this.bookings && this.bookings.length >= this.capacity;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  const bookedCount = this.bookings ? this.bookings.length : 0;
  return Math.max(0, this.capacity - bookedCount);
});

// Method to get event with bookings count
eventSchema.methods.toEventJSON = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    organizer: this.organizer,
    category: this.category,
    dateTime: this.dateTime,
    location: this.location,
    price: this.price,
    capacity: this.capacity,
    images: this.images,
    status: this.status,
    tags: this.tags,
    featured: this.featured,
    views: this.views,
    rating: this.rating,
    isSoldOut: this.isSoldOut,
    availableSpots: this.availableSpots,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Event', eventSchema); 