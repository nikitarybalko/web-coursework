"use client";

import { useRestaurant } from "@/app/providers/RestaurantContext";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal";
import DishForm from "@/components/dashboard/DishForm";
import Card from "@/components/ui/Card/Card";
import { fetchMenuForRestaurant } from "@/lib/utils";
import { CategoryWithDishes, Dish } from "@/types/Restaurant";
import { Edit, ImageOff, Loader2, Plus, Trash2, X } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

export default function Menu() {
  const { restaurant } = useRestaurant();

  const [menuData, setMenuData] = useState<CategoryWithDishes[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isCatDeleteOpen, setIsCatDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithDishes | null>(null);

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isDishDeleteOpen, setIsDishDeleteOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  const fetchMenu = useCallback(async () => {
    if (restaurant?.id) {
      setIsLoadingMenu(true);
      try {
        const session = await getSession();
        const data = await fetchMenuForRestaurant(
          restaurant.id,
          session?.idToken,
        );
        setMenuData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingMenu(false);
      }
    } else if (restaurant === null) {
      setIsLoadingMenu(false);
    }
  }, [restaurant]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCatModalOpen(true);
  };
  const handleEditCategory = (cat: CategoryWithDishes) => {
    setSelectedCategory(cat);
    setIsCatModalOpen(true);
  };

  const handleAddDish = (categoryId?: number) => {
    setSelectedDish(null);
    setSelectedCategoryId(categoryId);
    setIsDishModalOpen(true);
  };
  const handleEditDish = (dish: Dish, categoryId?: number) => {
    setSelectedDish(dish);
    setSelectedCategoryId(categoryId);
    setIsDishModalOpen(true);
  };

  return (
    <div className="flex flex-col py-6 relative">
      <div className="px-10 flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Керування меню: {restaurant?.name || "Завантаження..."}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Додавайте страви та об&apos;єднуйте їх у категорії
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 py-2 px-4 text-sm rounded-xl bg-white border border-brand-green-primary text-brand-green-primary font-medium hover:bg-green-50 transition-colors"
          >
            <Plus width="18" /> Додати категорію
          </button>
          <button
            onClick={() => handleAddDish()}
            className="flex items-center gap-2 py-2 px-4 text-sm rounded-xl bg-brand-green-primary text-white font-medium hover:bg-brand-green-secondary transition-colors"
          >
            <Plus width="18" /> Додати страву
          </button>
        </div>
      </div>

      <hr className="border-gray-200 mb-6 mx-10" />

      <div className="flex flex-col gap-8 px-10">
        {isLoadingMenu ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand-green-primary" />
            <p>Завантажуємо меню...</p>
          </div>
        ) : menuData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-300 rounded-2xl">
            <p className="text-gray-500 mb-4">Меню поки порожнє.</p>
            <button
              onClick={handleAddCategory}
              className="text-brand-green-primary font-medium hover:underline"
            >
              Створіть першу категорію
            </button>
          </div>
        ) : (
          menuData.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start"
            >
              <Card className="top-0 border-gray-100 flex flex-col gap-4 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {category.name}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {category.dishes.length} позицій
                  </span>
                </div>
                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 flex justify-center py-1.5 text-gray-500 hover:text-brand-green-primary hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCatDeleteOpen(true);
                    }}
                    className="flex-1 flex justify-center py-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>

              <div className="flex flex-wrap gap-4">
                {category.dishes.map((dish) => (
                  <Card
                    key={dish.id}
                    className="group relative flex flex-col w-full sm:w-50 h-auto gap-3 hover:shadow-md transition-all duration-300"
                  >
                    <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDish(dish, category.id);
                        }}
                        className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-brand-green-primary rounded-lg shadow-sm hover:bg-white transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDish(dish);
                          setIsDishDeleteOpen(true);
                        }}
                        className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-600 rounded-lg shadow-sm hover:bg-white transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div
                      className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDish(dish, category.id);
                      }}
                    >
                      {dish.imagePath ? (
                        <Image
                          src={dish.imagePath}
                          alt={dish.name}
                          fill
                          sizes="200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-300">
                          <ImageOff size={24} className="mb-1" />
                        </div>
                      )}
                    </div>

                    <div
                      className="flex flex-col justify-between flex-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDish(dish, category.id);
                      }}
                    >
                      <span
                        className="font-medium text-gray-800 line-clamp-2"
                        title={dish.name}
                      >
                        {dish.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {dish.description}
                      </span>
                      <span className="text-brand-green-primary font-bold mt-2">
                        {dish.price} ₴
                      </span>
                    </div>
                  </Card>
                ))}

                <button
                  onClick={() => handleAddDish(category.id)}
                  className="flex flex-col items-center justify-center w-full sm:w-50 min-h-40 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-brand-green-primary hover:border-brand-green-primary hover:bg-green-50 transition-colors"
                >
                  <Plus size={24} className="mb-2" />
                  <span className="text-sm font-medium">Додати страву</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- МОДАЛКИ --- */}

      {/* Обгортка для твоєї форми категорії, щоб вона працювала як попап */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Кнопка закриття поверх форми */}
            <button
              onClick={() => setIsCatModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/20 p-2 rounded-full"
            >
              <X size={24} />
            </button>
            <CategoryForm
              initialData={selectedCategory}
              onCancel={() => setIsCatModalOpen(false)}
              onSuccess={() => {
                setIsCatModalOpen(false);
                fetchMenu();
              }}
            />
          </div>
        </div>
      )}

      <DeleteCategoryModal
        isOpen={isCatDeleteOpen}
        onClose={() => setIsCatDeleteOpen(false)}
        category={selectedCategory}
        onSuccess={() => {
          setIsCatDeleteOpen(false);
          fetchMenu();
        }}
      />

      <DishForm
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        initialData={selectedDish}
        categories={menuData}
        restaurantId={restaurant?.id}
        initialCategoryId={selectedCategoryId}
        onSuccess={() => {
          setIsDishModalOpen(false);
          fetchMenu();
        }}
      />

      {/* Розкоментуй, коли створиш DeleteDishModal */}
      {/* 
      <DeleteDishModal 
        isOpen={isDishDeleteOpen}
        onClose={() => setIsDishDeleteOpen(false)}
        dish={selectedDish}
        onSuccess={() => { setIsDishDeleteOpen(false); fetchMenu(); }}
      /> 
      */}
    </div>
  );
}
