# Test data script - run with: node test-data.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Event = require('./src/models/Event');

// Load environment variables
dotenv.config();

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create test organizer user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const organizer = new User({
      name: 'Test Organizer',
      email: 'organizer@test.com',
      password: hashedPassword,
      accountType: 'organizer',
      phone: '1234567890',
      location: {
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country'
      },
      isVerified: true
    });

    await organizer.save();
    console.log('Created organizer user:', organizer.email);

    // Create test attendee user
    const attendee = new User({
      name: 'Test Attendee',
      email: 'attendee@test.com',
      password: hashedPassword,
      accountType: 'attendee',
      phone: '0987654321',
      location: {
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country'
      },
      isVerified: true
    });

    await attendee.save();
    console.log('Created attendee user:', attendee.email);

    // Create test event
    const testEvent = new Event({
      title: 'Test Music Event',
      description: 'This is a test music event with a description that is longer than 10 characters to meet the validation requirements. It will be a great event with live music and entertainment.',
      organizer: organizer._id,
      category: 'Music',
      dateTime: new Date('2024-12-25T18:00:00.000Z'),
      location: {
        venue: 'Test Concert Hall',
        address: '123 Music Street',
        city: 'Test City',
        state: 'Test State',
        coordinates: [0, 0]
      },
      price: 25,
      capacity: 100,
      status: 'published',
      images: [],
      tags: ['music', 'live', 'concert']
    });

    await testEvent.save();
    console.log('Created test event:', testEvent.title);

    // Verify data was created
    const users = await User.find({});
    const events = await Event.find({});
    
    console.log('\n=== Database Summary ===');
    console.log('Users:', users.length);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.accountType}`);
    });
    
    console.log('\nEvents:', events.length);
    events.forEach(event => {
      console.log(`- ${event.title} (${event.status}) - ${event.category}`);
    });

    console.log('\nTest data created successfully!');
    console.log('\nYou can now:');
    console.log('1. Login as organizer@test.com with password: password123');
    console.log('2. Login as attendee@test.com with password: password123');
    console.log('3. Create events as organizer');
    console.log('4. Browse and book events as attendee');

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

createTestData(); 