import Header from "@/components/common/Header/Header";
import React from "react";
import CategorySlider from "@/components/common/CategorySlider/CategorySlider";
import { ChevronDown } from "lucide-react";
import Footer from "@/components/common/Footer/Footer";
import { fetchAllDishes, fetchCategories } from "@/lib/utils";
import FoodListClient from "@/components/food/FoodListClient";
import SearchCategorySlider from "@/components/food/SearchCategorySlider";
import FoodSearchBar from "@/components/food/FoodSearchBar";

export default async function FoodPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const params = await searchParams;
  const search = params.search;
  const categoryId = params.categoryId;

  const [categories, pageData] = await Promise.all([
    fetchCategories(),
    fetchAllDishes(0, 12, search, categoryId),
  ]);

  const selectedCategoryName = categoryId
    ? categories.find((c) => String(c.id) === categoryId)?.name
    : null;

  return (
    <>
      <Header />
      <main className="flex flex-col grow bg-background pt-std px-std min-w-0">
        <div className="flex flex-col max-w-page-max-w w-full mx-auto self-center">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Вся їжа</h1>

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

            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
              Сортувати за популярністю
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <FoodListClient
            initialDishes={pageData.content}
            initialHasMore={pageData.page.number + 1 < pageData.page.totalPages}
            currentSearch={search}
            currentCategoryId={categoryId}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
