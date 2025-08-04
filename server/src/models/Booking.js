const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Attendee is required']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'pending'
  },
  ticketCount: {
    type: Number,
    required: [true, 'Ticket count is required'],
    min: [1, 'At least 1 ticket is required'],
    default: 1
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'card', 'upi', 'netbanking'],
    default: 'razorpay'
  },
  paymentId: {
    type: String,
    trim: true
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  checkInStatus: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

bookingSchema.index({ event: 1, status: 1 });
bookingSchema.index({ attendee: 1, status: 1 });
bookingSchema.index({ bookingDate: -1 });

bookingSchema.methods.toBookingJSON = function() {
  return {
    id: this._id,
    event: this.event,
    attendee: this.attendee,
    bookingDate: this.bookingDate,
    status: this.status,
    ticketCount: this.ticketCount,
    totalAmount: this.totalAmount,
    paymentStatus: this.paymentStatus,
    paymentMethod: this.paymentMethod,
    paymentId: this.paymentId,
    specialRequests: this.specialRequests,
    checkInStatus: this.checkInStatus,
    checkInTime: this.checkInTime,
    refundAmount: this.refundAmount,
    refundReason: this.refundReason,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

bookingSchema.statics.getBookingStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { event: mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount
    };
    return acc;
  }, {});
};

module.exports = mongoose.model('Booking', bookingSchema); 