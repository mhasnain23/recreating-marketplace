"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { productsFormAction } from "@/actions";
import { initialProductFormData } from "@/app/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  // productId: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  productStock: string;
  productImage: string;
}

const AddNewProduct = () => {
  const [productFormData, setProductFormData] = useState<ProductFormProps>({
    // productId: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: "",
    productImage: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // console.log(productFormData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productFormData) {
      setError("All fields are required.");
      return;
    }
    if (Number(productFormData.productStock) <= 0) {
      setError("Out of stock"); // Logic for out of stock
      return;
    }
    setError(""); // clear error

    // Handle form submission logic here
    const response = await productsFormAction(productFormData, "/products");
    // console.log(response);

    if (!response) {
      setError("Failed to add product");
    }

    if (response) {
      window.location.reload();
    }
    if (response) {
      setOpenDialog(false);
      setProductFormData({
        // productId: "",
        productName: "",
        productDescription: "",
        productPrice: "",
        productStock: "",
        productImage: "",
      });
    }
  };

  function handleBtnValid() {
    return (
      productFormData.productName.trim() &&
      productFormData.productDescription.trim() &&
      productFormData.productPrice &&
      productFormData.productStock &&
      productFormData.productImage.trim()
    );
  }

  console.log(productFormData);

  return (
    <div className="font-[poppins]">
      <Button
        onClick={() => setOpenDialog(true)}
        className="hover:bg-[#470ca5] dark:bg-[#6D28D9] hover:text-white/90 transition-all ease-in-out duration-[0.3s]"
      >
        Add New Product
      </Button>
      <Dialog
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(false);
          setProductFormData({
            productName: "",
            productDescription: "",
            productPrice: "",
            productStock: "",
            productImage: "",
          });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-semibold">Add New Product</h3>
          </DialogHeader>
          {/* product form component which will be used to add new product */}
          <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit}>
              <div>
                <Label>Product Name:</Label>
                <Input
                  type="text"
                  value={productFormData.productName}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      productName: e.target.value,
                    })
                  }
                  required
                />
                {error && <span style={{ color: "red" }}>{error}</span>}
              </div>
              <div>
                <Label>Product Description:</Label>
                <Textarea
                  value={productFormData.productDescription}
                  onChange={(e) => {
                    console.log(e);
                    setProductFormData({
                      ...productFormData,
                      productDescription: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <div>
                <Label>Product Price:</Label>
                <Input
                  type="number"
                  value={productFormData.productPrice}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      productPrice: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label>Product Stock:</Label>
                <Input
                  type="number"
                  value={productFormData.productStock}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      productStock: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label>Product Image:</Label>
                <Input
                  type="text"
                  placeholder="Enter product image url"
                  value={productFormData.productImage}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      productImage: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-center w-full mt-5">
                <Button
                  type="submit"
                  disabled={!handleBtnValid()}
                  className="disabled:bg-[#4f288f] text-white bg-[#6D28D9] font-bold tracking-tight hover:text-white/80 hover:bg-violet-800 flex items-center w-full"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewProduct;
