"use client";

import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import RatingSvg from "../rating-svg";
import { Button } from "../ui/button";
import { Product, UserInfo } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  editProductAction,
  deleteProductAction,
  fetchProductsAction,
} from "@/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/redux/cartSlice";
import { toast } from "sonner";

interface ProductCardProps {
  products: Product[] | undefined;
  userInfo: UserInfo;
}

interface EditProductForm {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  productStock: string;
  productImage: string;
}

const HomeBooksCard = ({ products, userInfo }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editProductForm, setEditProductForm] = useState<EditProductForm>({
    productId: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: "",
    productImage: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state: any) => state.cart.items);

  const isInCart = (productId: string) => {
    return cartItems.some((item: any) => item._id === productId);
  };

  const handleCartAction = (product: Product) => {
    if (isInCart(product._id)) {
      dispatch(removeFromCart(product._id));
      toast.success("Removed from cart!");
    } else {
      dispatch(addToCart(product));
      toast.success("Added to cart!");
    }
  };

  useEffect(() => {
    if (isLoading) {
      router.refresh();
    }

    // Function to fetch products
    const fetchProducts = async () => {
      try {
        await fetchProductsAction(); // Fetch updated products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // Fetch products initially
    fetchProducts();

    // Set up polling to fetch products every 5 seconds
    const intervalId = setInterval(fetchProducts, 5000); // 5000 ms = 5 seconds

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product._id);
    setEditProductForm({
      productId: product._id,
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice.toString(),
      productStock: product.productStock.toString(),
      productImage: product.productImage,
    });
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form data
      if (
        !editProductForm.productName ||
        !editProductForm.productDescription ||
        !editProductForm.productPrice ||
        !editProductForm.productStock ||
        !editProductForm.productImage
      ) {
        throw new Error("All fields are required");
      }

      setIsLoading(true);

      const response = await editProductAction(editProductForm);

      if (!response.success) {
        throw new Error(response.message);
      }

      // Close dialog and reset form
      setIsLoading(false);
      setIsEditing(false);
      setEditingProduct(null);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating product:", error);
      // Handle error (show error message to user)
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await deleteProductAction(productId);

      if (!response.success) {
        throw new Error(response.message);
      }

      // Close dialogs and reset states
      setIsLoading(false);
      setIsEditing(false);
      setEditingProduct(null);

      // Refresh the page to show deleted products
      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
      // Handle error (show error message to user)
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-white/80 mt-8">
        No products available
      </div>
    );
  }

  console.log(editProductForm, "editProductForm");

  return (
    // <main className="lg:max-w-7xl w-screen mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 px-10">
      {products.map((product: Product) => (
        <Card
          key={product._id}
          className="hover:scale-[1.07] transition-all ease-in duration-[0.2s] p-0"
        >
          <CardContent className="p-0">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Link
                href={
                  product.productStock <= 0 ? "/products" : `/${product._id}`
                }
              >
                <Image
                  className="p-8 rounded-2xl object-cover"
                  src={product.productImage}
                  alt={product.productName}
                  width={400}
                  height={300}
                  quality={100}
                  priority
                />
              </Link>
              <div className="px-5 pb-5">
                <Link href="/">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {product.productName}
                  </h5>
                </Link>
                <div className="flex items-center mt-2.5 mb-5">
                  <RatingSvg />
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                    5.0
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${product.productPrice}
                  </span>
                  {userInfo.data?.role === "buyer" && (
                    <Button
                      size={"sm"}
                      className={`text-white rounded-lg text-sm disabled:bg-gray-400 ${
                        isInCart(product._id)
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-[#6D28D9] hover:bg-[#5b21b6]"
                      }`}
                      disabled={product.productStock <= 0}
                      onClick={() => handleCartAction(product)}
                    >
                      {product.productStock <= 0
                        ? "Out of Stock"
                        : isInCart(product._id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
                    </Button>
                  )}
                  {userInfo?.data?.role === "vendor" && (
                    <Dialog
                      open={isEditing && editingProduct === product._id}
                      onOpenChange={setIsEditing}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEdit(product)}
                          className="mt-2 bg-purple-600 hover:bg-purple-700"
                        >
                          Edit Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div>
                              <Label>Product Name:</Label>
                              <Input
                                type="text"
                                name="productName"
                                value={editProductForm.productName}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div>
                              <Label>Product Description:</Label>
                              <Textarea
                                name="productDescription"
                                value={editProductForm.productDescription}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div>
                              <Label>Product Price:</Label>
                              <Input
                                type="number"
                                name="productPrice"
                                value={editProductForm.productPrice}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div>
                              <Label>Product Stock:</Label>
                              <Input
                                type="number"
                                name="productStock"
                                value={editProductForm.productStock}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div>
                              <Label>Product Image:</Label>
                              <Input
                                type="text"
                                name="productImage"
                                value={editProductForm.productImage}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <DialogFooter className="flex justify-between items-center mt-4 gap-4">
                              <div className="flex gap-5">
                                <Button
                                  className="bg-gray-800 hover:bg-gray-900"
                                  disabled={isLoading}
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  disabled={isLoading}
                                  type="submit"
                                  className="bg-[#6D28D9]"
                                >
                                  {isLoading ? (
                                    <Loader2Icon className="animate-spin" />
                                  ) : (
                                    "Save Changes"
                                  )}
                                </Button>
                              </div>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button className="bg-red-600 hover:bg-red-700">
                                    Delete Product
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the product.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className="border-none bg-gray-800"
                                      disabled={isLoading}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      disabled={isLoading}
                                      onClick={() => handleDelete(product._id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isLoading ? (
                                        <Loader2Icon className="animate-spin" />
                                      ) : (
                                        "Delete"
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DialogFooter>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    // </main>
  );
};

export default HomeBooksCard;
