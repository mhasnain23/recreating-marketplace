import {
  fetchProductsAction,
  fetchUserAction,
  searchProducts,
} from "@/actions";
import AddNewProduct from "@/components/AddNewProduct";
import ProductCard from "@/components/product-card";
import SearchComponent from "@/components/ProductFilter/index";
import { ProductResponse, UserInfo } from "@/types";

interface ProductsPageProps {
  searchParams: { query?: string };
}

export const dynamic = "force-dynamic"; // Force dynamic rendering

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const userInfo: UserInfo = await fetchUserAction();
  const products: ProductResponse = searchParams.query
    ? await searchProducts(searchParams.query)
    : await fetchProductsAction();

  return (
    <div className="max-w-7xl mx-auto font-[poppins] mt-[10rem]">
      <div className="w-full h-full xl:max-w-7xl flex justify-between items-center px-15">
        <div>
          <h2 className="lg:text-4xl text-2xl font-semibold tracking-tight text-white/80">
            {searchParams.query
              ? `Search results for "${searchParams.query}"`
              : userInfo.data?.role === "vendor"
              ? "My Products"
              : "All Products"}
          </h2>
        </div>
        <div>
          {userInfo.data?.role === "buyer" ? (
            <SearchComponent />
          ) : (
            <div className="flex w-full h-full items-center justify-center gap-5">
              <SearchComponent />
              <AddNewProduct />
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full xl:max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center px-15 mt-10">
          <ProductCard products={products.data} userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
