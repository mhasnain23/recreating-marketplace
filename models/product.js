import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      index: true,
    },
    productDescription: {
      type: String,
      required: true,
      index: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
    productStock: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Remove the text index and use regular indexes instead
productSchema.index({ productName: 1, productDescription: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
