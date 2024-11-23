import mongoose from "mongoose";

// Define the Product schema with vendorId
const productSchema = new mongoose.Schema({
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
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
