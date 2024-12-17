import { Schema, model, models } from "mongoose";

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
