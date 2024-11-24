"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchUserAction, logoutAction } from "@/actions";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { DialogTitle, DialogTrigger } from "../ui/dialog";

interface UserData {
  id: string;
  email: string;
  userName: string;
  password: string;
  role: string;
}

const Navbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const userInfo = await fetchUserAction();
      if (userInfo.success) setUserData(userInfo.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // console.log(userData);

  useEffect(() => {
    fetchUserData();
    router.refresh();
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setUserData(null);
    router.push("/");
  };

  const menuItems = [
    {
      path: "/",
      text: "Home",
      show: true,
    },
    {
      path: "/dashboard",
      text: "Dashboard",
      show: !!userData, // Agar user logged in hai to dikhayega
    },
    {
      path: "/products",
      text: "Products",
      show: !!userData, // Same yahan bhi
    },
    {
      path: "/cart",
      text: "Cart",
      show: !!userData && userData.role !== "vendor", // Vendor ko cart nahi dikhayega
    },
  ];

  return (
    <nav>
      <div className="fixed top-0 z-10 w-full mx-auto font-[poppins] bg-white bg-opacity-10 backdrop-blur-lg shadow-md border-b border-gray-500">
        <div className="max-w-7xl mx-auto h-[70px] flex items-center justify-between">
          <div className="h-[40px] flex items-center justify-center">
            <h1 className="text-3xl dark:text-white/90 font-extrabold tracking-tight capitalize">
              <Link href={"/"}>
                B2B
                <span className="text-[#6D28D9]"> Marketplace</span>
              </Link>
            </h1>
          </div>
          <div className="lg:flex hidden items-center justify-center px-5 gap-14">
            {menuItems.map((item, index) => (
              <span
                key={index}
                className="text-[12px] font-bold dark:text-white dark:hover:text-white/70 hover:border-b pb-1 dark:border-white/70 border-gray-600 transition-all ease-linear duration-[0.1s]"
              >
                {item.show ? <Link href={item.path}>{item.text}</Link> : null}
              </span>
            ))}
            <div className="flex items-center justify-center">
              <button
                className="text-white bg-[#6D28D9] rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() =>
                  userData ? handleLogout() : router.push("/sign-in")
                }
              >
                {userData ? "Sign Out" : "Login"}
              </button>
            </div>
          </div>
          {/* for mobile navigation  */}
          <div className="flex lg:hidden items-center justify-center px-4">
            <Sheet
              open={isSheetOpen}
              onOpenChange={() => setIsSheetOpen(false)}
            >
              <Button
                variant={"secondary"}
                onClick={() => setIsSheetOpen(true)}
                className="flex items-center justify-center p-2 cursor-pointer"
              >
                <MenuIcon className="w-6 h-6" />
              </Button>
              <SheetContent>
                <SheetHeader>
                  <span className="font-semibold text-3xl text-center tracking-tight leading-3 text-white/90">
                    Menu
                  </span>
                </SheetHeader>
                <DialogTitle className="mt-24">
                  <h2 className="font-bold tracking-tight text-center text-white/90 text-5xl">
                    B2B <span className="text-[#6D28D9]"> Marketplace</span>
                  </h2>
                </DialogTitle>
                <div className="flex flex-col items-center justify-center p-16">
                  <ul className="flex flex-col gap-6">
                    {menuItems.map((item) => (
                      <Link
                        className="text-[15px] font-bold dark:text-white dark:hover:text-white/70 hover:border-b pb-1 dark:border-white/70 border-gray-600 transition-all ease-linear duration-[0.1s]"
                        href={item.path}
                      >
                        <li key={item.text}>{item.show ? item.text : null}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    className="text-white bg-[#6D28D9] rounded-lg text-sm text-center"
                    size={"lg"}
                    onClick={() =>
                      userData ? handleLogout() : router.push("/sign-in")
                    }
                  >
                    {userData ? "Sign Out" : "Login"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
