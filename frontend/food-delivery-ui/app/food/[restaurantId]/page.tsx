import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import {
  fetchAllDishes,
  fetchCategories,
  fetchCategoriesByRestaurant,
  getRestaurantById,
} from "@/lib/utils";
import FoodListClient from "@/components/food/FoodListClient";
import SearchCategorySlider from "@/components/food/SearchCategorySlider";
import FoodSearchBar from "@/components/food/FoodSearchBar";
import FoodSortSelect from "@/components/food/FoodSortSelect";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default async function RestaurantMenuPage({
  params,
  searchParams,
}: {
  params: { restaurantId: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const restaurantId = resolvedParams.restaurantId;
  const search = resolvedSearchParams.search;
  const categoryId = resolvedSearchParams.categoryId;
  const sort = resolvedSearchParams.sort;

  const [categories, pageData] = await Promise.all([
    fetchCategoriesByRestaurant(restaurantId),
    fetchAllDishes({
      page: 0,
      size: 12,
      search: search,
      categoryId: categoryId,
      restaurantId: restaurantId,
      sort: sort,
    }),
  ]);

  const restaurant = await getRestaurantById(restaurantId);

  const selectedCategoryName = categoryId
    ? categories.find((c) => String(c.id) === categoryId)?.name
    : null;

  console.log(pageData.content);

  return (
    <>
      <Header />
      <main className="flex flex-col grow bg-background pt-std px-std min-w-0">
        <div className="flex flex-col max-w-page-max-w w-full mx-auto self-center mb-10">
          <Link
            href="/food"
            className="inline-flex items-center text-gray-500 hover:text-black mb-6 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> До всіх закладів
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Image
                src={restaurant.imagePath}
                width={100}
                height={100}
                alt="Логотип закладу"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                Меню закладу &quot;{restaurant.name}&quot;
              </h1>
            </div>
            <FoodSearchBar />
          </div>

          <div className="mb-10">
            <SearchCategorySlider categories={categories} />
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-medium">
              {search
                ? `Результати пошуку: "${search}"`
                : selectedCategoryName
                  ? selectedCategoryName
                  : "Популярне"}
            </span>
            <FoodSortSelect />
          </div>

          <FoodListClient
            initialDishes={pageData.content}
            initialHasMore={pageData.page.number + 1 < pageData.page.totalPages}
            currentSearch={search}
            currentCategoryId={categoryId}
            currentSort={sort}
            currentRestaurantId={restaurantId}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
