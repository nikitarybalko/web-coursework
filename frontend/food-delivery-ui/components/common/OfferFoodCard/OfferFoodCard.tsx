"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Dish } from "@/types/Restaurant";
import Image from "next/image";
import { Check } from "lucide-react";

interface FoodCardProps {
  title: string;
  tags: string;
  badge: string;
  imageUrl: string;
}

export default function OfferFoodCard({
  title,
  tags,
  badge,
  imageUrl,
}: FoodCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full group">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <Image
          fill
          src={imageUrl || "/placeholder-image.jpg"}
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover"
        />

        {/* Бейдж зі знижкою */}
        {badge && (
          <div className="absolute top-3 right-3 bg-[#8B5CF6] text-white text-xs font-medium px-2 py-1 rounded-md">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-[#625B71] truncate">{tags}</p>
      </div>
    </div>
  );
}
