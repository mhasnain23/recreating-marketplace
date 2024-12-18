import mongoose from "mongoose";


// Cached connection type

async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI!)
        .then(() => console.log("connected to MongoDB")).catch((err) => console.log(err))
}

export default connectDB;