import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full bottom-0">
      <footer className="bg-[#1D202A] text-white flex lg:flex-row flex-col items-center justify-between text-center p-10">
        <nav className="grid grid-flow-col gap-4 justify-center">
          <h1 className="text-2xl dark:text-white/90 font-extrabold tracking-tight capitalize">
            <Link href={"/"}>
              B2B
              <span className="text-[#6D28D9]"> Marketplace</span>
            </Link>
          </h1>
        </nav>
        <aside className="mt-4">
          <p>
            Copyright © {new Date().getFullYear()} - All rights reserved by{" "}
            <Link
              href={"https://discord.gg/ThYcQ7WZ"}
              target="_blank"
              className="hover:border-b hover:border-b-white transition-all ease-in-out duration-200"
            >
              Muhammad Hasnain
            </Link>
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
