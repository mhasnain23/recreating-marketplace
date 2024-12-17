// models/product.js
import { Schema, model, models } from "mongoose";

// Check if the code is running in a client-side environment
// if (typeof window !== "undefined") {
//   throw new Error("Mongoose models cannot be used on the client-side");
// }

// Define the schema for the Product model
const productSchema = new Schema({
  productName: {
    type: String,
    required: true, // This field is required
  },
  productDescription: {
    type: String,
    required: true, // This field is required
  },
  productStock: {
    type: Number,
    required: true, // This field is required
  },
  productPrice: {
    type: Number,
    required: false, // This field is optional
  },
  productImage: {
    type: String,
    required: true, // This field is required
  },
});

// Create the Product model using the schema
const Product = models.Product || model("Product", productSchema);

// Export the Product model for use in other parts of the application
export default Product;
