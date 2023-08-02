import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!) 
    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('MongoDB connected');
    });
  } catch (error) {
    console.log(error);
  }
}