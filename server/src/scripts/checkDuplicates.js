import mongoose from 'mongoose';
import User from '../models/user_schema.js';

mongoose.connect('mongodb://localhost:27017/test');

async function checkAndCleanData() {
  try {
    const usersWithNullFields = await User.find({
      $or: [{ userId: null }, { username: null }, { email: null }]
    });

    if (usersWithNullFields.length > 0) {
      console.log('Found users with null fields:', usersWithNullFields);
      // Uncomment the line below to delete the found users
      // await User.deleteMany({ $or: [{ userId: null }, { username: null }, { email: null }] });
      console.log('Deleted users with null fields');
    } else {
      console.log('No users with null fields found');
    }
  } catch (error) {
    console.error('Error checking and cleaning data:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkAndCleanData();
