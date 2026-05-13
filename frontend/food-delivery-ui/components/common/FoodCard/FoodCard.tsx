"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Dish } from "@/types/Restaurant";
import Image from "next/image";
import { Check } from "lucide-react";

interface FoodCardProps {
  dish: Dish;
}

export default function FoodCard({ dish }: FoodCardProps) {
  const { addItem } = useCartStore();

  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAdded) return;

    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      imagePath: dish.imagePath,
      restaurantId: dish.restaurantId,
    });

    console.log(dish.restaurantId);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full group">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <Image
          fill
          src={dish.imagePath || "/placeholder-image.jpg"}
          alt={dish.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover"
        />

        {/* Бейдж зі знижкою */}
        {/* {badge && (
          <div className="absolute top-3 right-3 bg-[#8B5CF6] text-white text-xs font-medium px-2 py-1 rounded-md">
            {badge}
          </div>
        )} */}
        <button
          // Динамічні класи: якщо isAdded = true, кнопка завжди видима і має інший стиль
          className={`absolute bg-brand-green-secondary text-white top-3 right-3 text-sm font-medium px-2 py-1 rounded-md shadow transition-all duration-300 flex items-center justify-center ${
            isAdded
              ? "opacity-100" // Стан після кліку (успіх)
              : "opacity-0 group-hover:opacity-100 hover:scale-105" // Звичайний стан
          }`}
          onClick={handleClick}
          disabled={isAdded} // Вимикаємо кнопку, поки горить галочка
        >
          {isAdded ? (
            <Check className="w-5 h-5 animate-in zoom-in" />
          ) : (
            "В кошик"
          )}
        </button>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">{dish.name}</h3>
          <span className="text-brand-green-primary font-semibold">
            {dish.price} грн
          </span>
        </div>
        <p className="text-sm text-[#625B71] truncate">{dish.description}</p>
      </div>
    </div>
  );
}
