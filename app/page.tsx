import { fetchProductsAction, fetchUserAction } from "@/actions";
import HomeBooksCard from "@/components/HomeBooksCard";
// import ProductCard from "@/components/product-card";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const userInfo = await fetchUserAction();

  // console.log(userInfo);

  const product = await fetchProductsAction();

  return (
    <main>
      <div className="py-2 xl:mt-20 mt-10 font-[poppins]">
        <div className="mx-auto max-w-7xl items-center justify-between flex flex-col lg:flex-row min-h-[80vh]">
          <div className="xl:max-w-4xl flex flex-col gap-10 py-20 order-2 lg:order-1">
            <h1 className="lg:text-6xl text-4xl font-extrabold tracking-tight line-height">
              Welcome to the <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r to-white from-[#6D28D9]">
                B2B Marketplace
              </span>
            </h1>
            <p className="text-white/80 text-lg font-bold">
              Connecting suppliers, manufacturers, and retailers.
            </p>
            <div className="flex">
              {userInfo ? null : (
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  <Link href="/unauth-page">Get Started</Link>
                </button>
              )}
            </div>
          </div>
          <div className="lg:w-[450px] h-[400px] py-10 mx-4 mt-5 xl:py-0 order-1">
            {/* we add an hero photo that's here */}
            <Image
              src={"/iphone_14.webp"}
              alt="iphone 14 pro max"
              width={400}
              height={400}
              priority
              quality={100}
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        </div>
        <div className="flex flex-col min-h-screen items-center justify-center">
          <h2 className="mb-12 text-4xl font-bold text-white/90">
            Latest Products
          </h2>
          <HomeBooksCard products={product.data} userInfo={userInfo} />
        </div>
      </div>
    </main>
  );
}
