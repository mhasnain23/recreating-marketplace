import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connection successful 🚀");
  } catch (error: any) {
    console.error("Database connection error: ", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;







// export default async function connectDB() {
//   const uri = process.env.MONGODB_URI;

//   if (!uri) {
//     throw new Error("❌ MONGODB_URI is not defined in the environment variables");
//   }

//   try {
//     await mongoose.connect(uri);
//     console.log("✅ Connected to MongoDB");
//   } catch (error: any) {
//     console.error("❌ Error connecting to MongoDB:", error.message);
//     throw error; // Rethrow the error if you want to handle it in the caller
//   }
// }
