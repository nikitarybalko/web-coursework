import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { fetchAllDishes } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FoodCard from "@/components/common/FoodCard/FoodCard";

export interface Dish {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  description: string;
  restaurantId: number;
  restaurantName: string;
}

interface RestaurantGroup {
  restaurantId: number;
  restaurantName: string;
  items: Dish[];
}

interface GroupedDishesMap {
  [key: string]: RestaurantGroup;
}

interface SearchPageProps {
  searchParams: { q?: string; categoryId?: string };
}

export default async function GlobalSearchPage({
  searchParams,
}: SearchPageProps) {
  const query = await searchParams;
  const searchQuery = query.q || "";
  const categoryId = query.categoryId || "";

  const pageData = await fetchAllDishes({
    search: searchQuery,
    categoryId: categoryId,
    page: 0,
    size: 100,
  });

  const dishes = pageData.content || [];

  const groupedDishes = dishes.reduce<GroupedDishesMap>((acc, dish) => {
    const rId = String(dish.restaurantId);
    if (!acc[rId]) {
      acc[rId] = {
        restaurantId: dish.restaurantId,
        restaurantName: dish.restaurantName,
        items: [],
      };
    }
    acc[rId].items.push(dish);
    return acc;
  }, {});

  const restaurantsGroups = Object.values(groupedDishes);

  return (
    <div className="bg-gray-bg min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-col grow px-std py-8">
        <div className="w-full max-w-page-max-w mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Результати пошуку
          </h1>
          {searchQuery && (
            <p className="text-gray-500 mb-8">
              За запитом «
              <span className="font-semibold text-gray-900">{searchQuery}</span>
              » знайдено страв: {dishes.length}
            </p>
          )}

          {categoryId && (
            <p className="text-gray-500 mb-8">
              <span className="font-semibold text-gray-900">{searchQuery}</span>
              Знайдено страв: {dishes.length}
            </p>
          )}

          {restaurantsGroups.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-gray-500 text-lg mb-1">Нічого не знайдено</p>
              <Link
                href="/"
                className="font-medium border-b-0 hover:border-b hover:border-b-brand-green-primary hover:text-brand-green-primary"
              >
                На головну
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {restaurantsGroups.map((group) => (
                <div key={group.restaurantId} className="flex flex-col gap-4">
                  {/* Заголовок закладу з лінком на його меню */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {group.restaurantName}
                    </h2>
                    <Link
                      href={`/food/${group.restaurantId}`}
                      className="flex items-center text-brand-green-primary hover:text-brand-green-primary/80 font-medium transition-colors"
                    >
                      В меню закладу <ChevronRight size={18} className="ml-1" />
                    </Link>
                  </div>

                  {/* Сітка страв для цього закладу */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {group.items.map((dish) => (
                      <FoodCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
