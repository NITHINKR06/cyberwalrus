import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = [
  {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123!',
    level: 1,
    totalPoints: 100,
    currentStreak: 5
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    level: 5,
    totalPoints: 500,
    currentStreak: 10
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'John123!',
    level: 2,
    totalPoints: 250,
    currentStreak: 3
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/walrus_db';
    console.log('Connecting to MongoDB:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // Clear existing users (optional - comment out if you want to keep existing data)
    const deleteResult = await User.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing users`);

    // Create users
    for (const userData of seedUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
          $or: [
            { email: userData.email },
            { username: userData.username }
          ]
        });

        if (existingUser) {
          console.log(`User ${userData.username} already exists, skipping...`);
          continue;
        }

        // Create new user (password will be hashed by the pre-save hook)
        const user = new User(userData);
        await user.save();
        
        console.log(`✅ Created user: ${userData.username} (${userData.email})`);
      } catch (error) {
        console.error(`Error creating user ${userData.username}:`, error.message);
      }
    }

    console.log('\n📝 Test Credentials:');
    console.log('------------------------');
    seedUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('------------------------');
    });

    console.log('\n✅ Database seeding completed!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
