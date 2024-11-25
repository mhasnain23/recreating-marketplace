import mongoose, { Schema, model, models } from "mongoose"; // Ensure mongoose is fully imported

if (typeof window !== "undefined") {
  throw new Error("Mongoose models cannot be used on the client-side");
}

const UserSchema = new Schema({
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

const UserModel = models.User || model("User", UserSchema);

export default UserModel;
