const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./src/models/Booking');
const Event = require('./src/models/Event');
const User = require('./src/models/User');

// Load environment variables
dotenv.config();

const fixIssues = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Fix booking status - auto-confirm pending bookings
    const pendingBookings = await Booking.find({ status: 'pending' });
    console.log(`Found ${pendingBookings.length} pending bookings`);

    for (const booking of pendingBookings) {
      booking.status = 'confirmed';
      await booking.save();
      console.log(`Confirmed booking for event: ${booking.event}`);
    }

    // 2. Fix image URLs - replace blob URLs with placeholder
    const eventsWithBlobImages = await Event.find({
      'images': { $regex: /^blob:/ }
    });

    console.log(`Found ${eventsWithBlobImages.length} events with blob images`);

    for (const event of eventsWithBlobImages) {
      // Replace blob URLs with a placeholder image
      event.images = ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'];
      await event.save();
      console.log(`Fixed images for event: ${event.title}`);
    }

    // Show updated data
    const allBookings = await Booking.find({}).populate('event attendee');
    console.log('\nUpdated bookings:');
    allBookings.forEach(booking => {
      console.log(`- Event: ${booking.event.title}, Attendee: ${booking.attendee.name}, Status: ${booking.status}`);
    });

    const allEvents = await Event.find({});
    console.log('\nUpdated events:');
    allEvents.forEach(event => {
      console.log(`- ${event.title}: ${event.images.length} images`);
      if (event.images.length > 0) {
        console.log(`  Images: ${JSON.stringify(event.images)}`);
      }
    });

    console.log('\nIssues fixed successfully!');
    console.log('1. All pending bookings are now confirmed');
    console.log('2. Blob image URLs replaced with placeholder images');

  } catch (error) {
    console.error('Error fixing issues:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

fixIssues(); 