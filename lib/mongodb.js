// lib/mongodb.js

import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    if (mongoose.connection.readyState === 1) {
       
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        throw new Error("MongoDB connection error");
    }
};
