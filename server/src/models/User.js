const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Profile Details
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  location: {
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'United States'
    }
  },
  
  // Preferences
  interests: [{
    type: String,
    enum: ['Music', 'Food & Drink', 'Workshops', 'Networking', 'Sports', 'Arts', 'Technology', 'Fitness']
  }],
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  // Event-related
  eventsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  eventsBooked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  
  // Account Info
  isVerified: {
    type: Boolean,
    default: false
  },
  accountType: {
    type: String,
    enum: ['attendee', 'organizer', 'both'],
    default: 'attendee'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile (without password)
userSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    bio: this.bio,
    profilePicture: this.profilePicture,
    location: this.location,
    interests: this.interests,
    notifications: this.notifications,
    eventsCreated: this.eventsCreated,
    eventsBooked: this.eventsBooked,
    isVerified: this.isVerified,
    accountType: this.accountType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('User', userSchema); 