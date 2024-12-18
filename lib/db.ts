import mongoose from "mongoose";
const DB_CONNECT_URI = process.env.MONGODB_URI!;

if (!DB_CONNECT_URI) {
    throw new Error('Please define the DB_CONNECT_URI environment variable inside .env');
}

// Cached connection type

async function connectDB() {
    try {
        const conn = await mongoose.connect(DB_CONNECT_URI);

        if (conn) {
            console.log("Connected to MongoDB");
        } else {
            console.log("Failed to connect to MongoDB");
        }
    } catch (error) {
        console.log(" Internal server error " + error);
    }
}

export default connectDB;