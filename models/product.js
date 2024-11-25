import mongoose from "mongoose";

// if (typeof window !== "undefined") {
//   throw new Error("Mongoose models cannot be used on the client-side");
// }

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productStock: {
    type: Number,
    required: true,
  },
  productPrice: {
    type: Number,
    required: false,
  },
  productImage: {
    type: String, // Changed to Number for price
    required: true,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
