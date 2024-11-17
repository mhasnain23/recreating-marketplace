import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionString = process.env.MONGODB_URI as string;
        mongoose.connect(connectionString);
        console.log("MongoDB is Connected Successfully");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;