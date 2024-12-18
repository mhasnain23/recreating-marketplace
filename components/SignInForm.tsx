"use client";

import { useState } from "react";
import { initialSignInFormData } from "@/app/utils";
import Link from "next/link";
import { loginUserAction } from "@/actions";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);

  // console.log(signInFormData);

  const router = useRouter();

  const handleSubmit = async () => {
    setErrorMessage("");
    const res = await loginUserAction(signInFormData);
    setSignInFormData(initialSignInFormData);
    if (res.success) {
      router.push("/products");
      window.location.reload();
    }
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center mt-20 px-10 font-[poppins]">
      <form action={handleSubmit} className="w-[40%] flex flex-col gap-6">
        <h1 className="lg:text-[2rem] my-8 font-extrabold font-[poppins] text-[#fff]/80">
          Login to your account
        </h1>
        <input
          value={signInFormData.email}
          onChange={(e) =>
            setSignInFormData({
              ...signInFormData,
              email: e.target.value,
            })
          }
          placeholder="Email"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer rounded-md"
        />

        <input
          value={signInFormData.password}
          onChange={(e) =>
            setSignInFormData({
              ...signInFormData,
              password: e.target.value,
            })
          }
          type="password"
          placeholder="Password"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer rounded-md"
        />

        <div>
          <button
            type="submit"
            className="text-white bg-[#6D28D9] font-medium rounded-lg text-sm px-7 py-2.5 text-center me-2 mt-5"
          >
            Sign In
          </button>
          {errorMessage && (
            <span className="text-red-500 text-lg tracking-tight font-bold">
              {errorMessage}
            </span>
          )}
        </div>
        <div className="mt-6 px-2">
          <span className="text-white/70 text-lg font-bold tracking-tight">
            don&apos;t have account?{" "}
            <Link className="text-[#6D28D9]" href={"/unauth-page"}>
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
