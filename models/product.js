import mongoose, { Schema, models, model } from "mongoose";

if (typeof window !== "undefined") {
  throw new Error("Mongoose models cannot be used on the client-side");
}

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: Number,
    required: true,
  },
  productStock: {
    type: Number,
    required: true,
  },
  productPrice: {
    type: String,
    required: false,
  },
  productImage: {
    type: String, // Changed to Number for price
    required: true,
  },
});

const Product = models.Product || model("Product", productSchema);
export default Product;
