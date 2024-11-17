"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

const SearchComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.get("query")) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearchTerm) {
        params.set("query", debouncedSearchTerm);
      } else {
        params.delete("query");
      }
      router.push(`/products?${params.toString()}`);
    }
  }, [debouncedSearchTerm, router, searchParams]);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="placeholder:text-gray-800 text-gray-900 w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6200ff]"
      />
    </div>
  );
};

export default SearchComponent;
