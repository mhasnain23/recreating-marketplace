import mongoose from "mongoose";

export default async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("MongoDB URI is not defined in the environment variables.");
        process.exit(1); // Exit the app if the URI is missing
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the app on connection failure
    }

    mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
        console.error(`❌ MongoDB connection error: ${err}`);
    });
}