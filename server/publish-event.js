const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./src/models/Event');

// Load environment variables
dotenv.config();

const publishEvent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the draft event
    const draftEvent = await Event.findOne({ title: 'Test Event', status: 'draft' });
    
    if (!draftEvent) {
      console.log('No draft event found with title "Test Event"');
      return;
    }

    // Update the status to published
    draftEvent.status = 'published';
    await draftEvent.save();

    console.log(`Event "${draftEvent.title}" has been published!`);
    console.log(`Status changed from draft to published`);

    // Show all events
    const allEvents = await Event.find({});
    console.log('\nAll events:');
    allEvents.forEach(event => {
      console.log(`- ${event.title} (${event.status}) - ${event.category}`);
    });

  } catch (error) {
    console.error('Error publishing event:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

publishEvent(); 