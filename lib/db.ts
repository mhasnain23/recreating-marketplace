import mongoose from "mongoose";


// Cached connection type

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
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