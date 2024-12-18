import mongoose from "mongoose";

export default async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("❌ MONGODB_URI is not defined in the environment variables");
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB");
    } catch (error: any) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        throw error; // Rethrow the error if you want to handle it in the caller
    }
}
