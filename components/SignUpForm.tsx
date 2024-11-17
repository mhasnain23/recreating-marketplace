"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { initialSignUpFormData } from "@/app/utils";
import { registerUserAction } from "@/actions";

// type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);

  const router = useRouter();

  /* I will fix this later as soon as possiblr  */

  // function handleSignUpBtnValid() {
  //   return Object.keys(signUpFormData).every(
  //     (keys) => signUpFormData[keys].trim() !== ""
  //   );
  // }

  const handleSubmit = async () => {
    try {
      const result = await registerUserAction(signUpFormData);
      // checking the response if it's ok😁
      if (result) {
        console.log(result);
        setSignUpFormData(initialSignUpFormData);
        router.push("/sign-in");
        // redirect("/sign-in");
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  console.log(signUpFormData);

  return (
    <div className="xl:min-h-[80vh] h-full flex w-full justify-center items-center font-[poppins] mt-20 px-10">
      <form action={handleSubmit} className="w-[40%] mx-auto">
        <h1 className="lg:text-[2rem] my-8 font-extrabold font-[poppins] text-[#fff]/85">
          Create your account
        </h1>
        {/* for username input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            value={signUpFormData.userName}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                userName: e.target.value,
                //[e.target.name]: e.target.value,
              })
            }
            placeholder="username"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent rounded border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
        </div>

        {/* for email input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            id="floating_email"
            value={signUpFormData.email}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                email: e.target.value,
              })
            }
            placeholder="Email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent rounded border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
        </div>

        {/* for password input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="floating_password"
            value={signUpFormData.password}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                password: e.target.value,
              })
            }
            type="password"
            placeholder="Password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          />
        </div>

        <div>
          <select
            required
            value={signUpFormData.role}
            onChange={(e) =>
              setSignUpFormData({
                ...signUpFormData,
                role: e.target.value,
              })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="buyer">Buyer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="disabled:opacity-65 text-white bg-[#6D28D9] font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-5"
          >
            Sign Up
          </button>
        </div>
        <div className="mt-6 px-2">
          <span className="text-white/70 text-lg font-bold tracking-tight">
            Already Have an account?{" "}
            <Link className="text-[#6D28D9]" href={"/sign-in"}>
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
