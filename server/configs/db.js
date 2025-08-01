import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/greencart`);
    console.log(`✅ MongoDB Connected Sucessfully`);

  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); 
  }
};

export default connectDB;
