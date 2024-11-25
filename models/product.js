import mongoose, { Schema, model, models } from "mongoose";

// Define the Product schema with vendorId
const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String, // Changed to String for description
    required: true,
  },
  productStock: {
    type: Number,
    required: true,
  },
  productPrice: {
    type: Number, // Changed to Number for price
    required: true,
  },
  productImage: {
    type: String, // Changed to Number for price
    required: true,
  },
});

const Product = models.Product || model("Product", productSchema);

export default Product;
