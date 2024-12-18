import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["vendor", "buyer"], // Define roles
    default: "buyer", // Default role
  },
});
// Export model if it exists, or create new one
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Specify Node.js runtime
export const runtime = 'nodejs';