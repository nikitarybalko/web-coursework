"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function FoodSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Беремо початкове значення з URL (якщо користувач оновив сторінку)
  const initialSearch = searchParams.get("search") || "";
  const [text, setText] = useState(initialSearch);

  // Дебаунс: чекаємо 500мс після останнього натискання клавіші
  const [debouncedText] = useDebounce(text, 500);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    if (debouncedText === currentSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedText) {
      params.set("search", debouncedText);
    } else {
      params.delete("search");
    }

    params.delete("page");

    router.push(`/food?${params.toString()}`, { scroll: false });
  }, [debouncedText, router, searchParams]);

  return (
    <div className="flex items-center gap-2 w-full md:w-100">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Пошук страв..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-green-primary rounded-xl transition-all outline-none"
        />
      </div>
      <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 shrink-0">
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
