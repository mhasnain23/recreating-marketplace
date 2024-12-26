import React from "react";
import { Card } from "@/components/ui/card"; // Adjust the import based on the actual path of your Card component
import Image from "next/image";
import { Button } from "../ui/button";
import { Toast, ToastProvider } from "../ui/toast";

interface ProductInfo {
  productImage: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
}

interface DetailsPageProps {
  getProductInfo: ProductInfo;
}

const DetailsPage: React.FC<DetailsPageProps> = ({ getProductInfo }) => {
  if (!getProductInfo) {
    return <div>Loading...</div>;
  }

  const {
    productImage,
    productName,
    productDescription,
    productPrice,
    productStock,
  } = getProductInfo;

  return (
    <div className="max-w-7xl mx-auto mt-[10rem]">
      <div className="w-full h-full flex items-center justify-center gap-10  xl:gap-[14rem]">
        <div className="xl:w-[500px] xl:h-[500px] flex items-center justify-start p-2">
          <Image
            src={productImage}
            alt={productName}
            width={400}
            height={400}
            priority
            quality={100}
            className="object-cover cursor-pointer hover:scale-[1.05] rounded-2xl transition-all ease-in duration-[0.2s]"
          />
        </div>
        <div className="xl:w-[600px] xl:h-[500px] flex justify-center mt-20 p-2">
          <div>
            <h2 className="text-5xl font-semibold tracking-tight text-white">
              {productName}
            </h2>
            <p className="text-white/60 mt-5">{productDescription}</p>
            <p className="text-lg font-semibold mt-5">Price: ${productPrice}</p>
            <p
              className={`${
                productStock <= 0
                  ? "text-md font-bold mt-4 text-red-600 bg-red-200 p-1 rounded-full"
                  : "text-md font-bold mt-4 text-green-600 bg-green-200 p-1 rounded-full"
              } w-[80px] flex items-center justify-center`}
            >
              {productStock <= 0 ? "Out of Stock" : "In Stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
