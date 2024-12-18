import mongoose from "mongoose";

const connectDB = async () => {
  const connectionURL = process.env.MONGODB_URL;

  mongoose
    .connect(connectionURL)
    .then(() => console.log("Job board connection is successfull"))
    .catch((e) => console.log(e));
};

export default connectDB;

// export default async function connectDB() {
//     const uri = process.env.MONGODB_URI;

//     if (!uri) {
//         throw new Error("❌ MONGODB_URI is not defined in the environment variables");
//     }

//     try {
//         await mongoose.connect(uri);
//         console.log("✅ Connected to MongoDB");
//     } catch (error: any) {
//         console.error("❌ Error connecting to MongoDB:", error.message);
//         throw error; // Rethrow the error if you want to handle it in the caller
//     }
// }
