"use client";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { createPaymentSession, fetchUserAction } from "@/actions";
import { useState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state: any) => state.cart);

  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetchUserAction();
      if (response.success) {
        setUserInfo(response.data);
      }
    };
    getUserInfo();
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleCheckout = async () => {
    try {
      if (!userInfo?._id) {
        toast.error("Please login to checkout");
        return;
      }

      setIsLoading(true);
      const response = await createPaymentSession(items, userInfo._id);

      if (!response.success) {
        throw new Error(response.error);
      }

      if (response.url) {
        window.location.href = response.url;
      }
      if (response.success) {
        redirect("/dashboard");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to create checkout session");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-[10rem] text-center text-white/80">
        Your cart is empty 😄
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-[10rem] px-4">
      <h1 className="text-3xl font-bold text-white/80 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item: any) => (
            <div
              key={item._id}
              className="bg-gray-800 p-4 rounded-lg flex gap-4"
            >
              <Image
                src={item.productImage}
                alt={item.productName}
                width={100}
                height={100}
                className="rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white/80">
                  {item.productName}
                </h3>
                <p className="text-white/60">${item.productPrice}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    variant="outline"
                    size="sm"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, parseInt(e.target.value))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    variant="outline"
                    size="sm"
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div className="bg-gray-800 p-4 rounded-lg h-fit">
          <h2 className="text-xl font-semibold text-white/80 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-lg font-semibold text-white/80">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-[#6D28D9]"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
