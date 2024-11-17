"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface ProductFormProps {
  productName: string;
  productDescription: string;
  productPrice: string;
  productStock: string;
  productImage: string;
}
const ProductForm = ({
  productFormData,
  setProductFormData,
  action,
  error,
}: {
  productFormData: ProductFormProps;
  setProductFormData: any;
  action: any;
  error: any;
}) => {
  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={action}>
        <div>
          <Label>Product Name:</Label>
          <Input
            type="text"
            value={productFormData.productName}
            onChange={(e) => setProductFormData(e.target.value)}
            required
          />
          {error && <span style={{ color: "red" }}>{error}</span>}
        </div>
        <div>
          <Label>Product Description:</Label>
          <Textarea
            value={productFormData.productDescription}
            onChange={(e) => setProductFormData(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Product Price:</Label>
          <Input
            type="number"
            value={productFormData.productPrice}
            onChange={(e) => setProductFormData(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Product Stock:</Label>
          <Input
            type="number"
            value={productFormData.productStock}
            onChange={(e) => setProductFormData(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Product Image:</Label>
          <Input
            type="text"
            placeholder="Enter product image url"
            value={productFormData.productImage}
            onChange={(e) => setProductFormData(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center w-full mt-5">
          <Button
            type="submit"
            className="text-white bg-[#6D28D9] font-bold tracking-tight hover:text-white/80 hover:bg-violet-800 flex items-center w-full"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
