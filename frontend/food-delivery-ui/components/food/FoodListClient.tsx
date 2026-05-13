"use client";

import React, { useEffect, useState } from "react";
import FoodCard from "@/components/common/FoodCard/FoodCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Dish } from "@/types/Restaurant";
import { fetchAllDishes } from "@/lib/utils";

interface FoodListClientProps {
  initialDishes: Dish[];
  initialHasMore: boolean;
  currentSearch?: string;
  currentCategoryId?: string;
  currentSort?: string;
  currentRestaurantId: string;
}

export default function FoodListClient({
  initialDishes,
  initialHasMore,
  currentSearch,
  currentCategoryId,
  currentSort,
  currentRestaurantId,
}: FoodListClientProps) {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDishes(initialDishes);
    setHasMore(initialHasMore);
    setPage(1);
  }, [
    initialDishes,
    initialHasMore,
    currentSearch,
    currentCategoryId,
    currentSort,
  ]);

  const loadMoreDishes = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const pageData = await fetchAllDishes({
        page: page,
        size: 12,
        search: currentSearch,
        categoryId: currentCategoryId,
        restaurantId: currentRestaurantId,
        sort: currentSort,
      });

      setDishes((prev) => [...prev, ...pageData.content]);
      setHasMore(pageData.page.number + 1 < pageData.page.totalPages);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Не вдалося завантажити страви:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {dishes.length === 0 && (
        <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-dashed">
          За вашим запитом нічого не знайдено 🍔
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {dishes.map((dish) => (
          <FoodCard key={dish.id} dish={dish} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 mb-8 flex justify-center">
          <Button
            variant="outline"
            className="text-base p-6 w-full sm:w-auto"
            onClick={loadMoreDishes}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                Завантаження...
              </>
            ) : (
              "Показати ще"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
