import { DATABASE_URL } from '../constants';
import mongoose from 'mongoose';

export class MongoTool {
  static initialize() {
    mongoose.connect(DATABASE_URL);
    mongoose.connection.on('error', (err) => {
      console.error('🚀 MongoDB connection error.', err);
      process.exit();
    });
  }
}
