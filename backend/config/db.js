const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGODB_URL, {});
      console.log('Database connected successfully '+ process.env.MONGODB_URL);
   } catch (error) {
      console.error('Database connection failed:', error.message);
      process.exit(1); 
   }
}
module.exports = connectDB;
