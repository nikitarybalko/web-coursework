"use client";

import { CategorySliderProps } from "@/types/Categories";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function SearchCategorySlider({
  categories,
}: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategoryId = searchParams.get("categoryId");

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

      setShowLeft(scrollLeft > 0);

      setShowRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const handleCategoryClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentCategoryId === id.toString()) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", id.toString());
    }
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      checkScroll();
      slider.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      slider?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const offset = direction === "left" ? -250 : 250;
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full mt-std">
      <h2 className="text-2xl font-medium">Категорії</h2>

      <div className="relative flex my-std group">
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-[calc(50%-22px)] w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all border border-gray-200 z-20"
            aria-label="Назад"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar w-full"
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {categories &&
            categories.map((category) => {
              const isActive = currentCategoryId === String(category.id);

              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-center gap-3 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ width: "calc(var(--spacing) * 35)" }}
                >
                  <div className="relative">
                    <div
                      className={`w-35 h-35 rounded-full flex items-center justify-center text-5xl ${currentCategoryId === String(category.id) ? "bg-brand-green-secondary" : "bg-gray-bg"}`}
                    >
                      {category.imagePath && (
                        <Image
                          width="100"
                          height="100"
                          src={category.imagePath}
                          alt={category.name}
                        />
                      )}
                    </div>
                    {isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Зупиняємо подію, щоб не було подвійного кліку
                          handleCategoryClick(category.id);
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-50 shadow-sm transition-all z-10"
                        aria-label="Скасувати фільтр"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={3} />
                      </button>
                    )}
                  </div>

                  <span className="w-full text-center text-sm font-semibold truncate px-1 text-gray-800">
                    {category.name}
                  </span>
                </div>
              );
            })}
        </div>

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-[calc(50%-22px)] w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all border border-gray-200 z-20"
            aria-label="Вперед"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}

        {showLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-white to-transparent pointer-events-none z-10" />
        )}
        {showRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent pointer-events-none z-10" />
        )}
      </div>
    </div>
  );
}
