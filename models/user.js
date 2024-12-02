import mongoose from "mongoose"; // Ensure mongoose is fully imported

// if (typeof window !== "undefined") {
//   throw new Error("Mongoose models cannot be used on the client-side");
// }

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

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
