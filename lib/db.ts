import mongoose from "mongoose";

export default async function connectDB() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is not defined");
    }

    mongoose
        .connect(uri)
        .then(() => console.log("✅ Connected to MongoDB"))
        .catch((error) => console.error("❌ Error connecting to MongoDB:", error));
}