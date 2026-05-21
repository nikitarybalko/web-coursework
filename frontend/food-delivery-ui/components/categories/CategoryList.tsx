"use client";

import React, { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";
import { Category } from "@/types/Categories";
import { useRouter } from "next/navigation";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import DeleteCategoryModal from "./DeleteCategoryModal";

interface CategoryListProps {
  categories: Category[];
  onEditClick: (category: Category) => void;
}

export default function CategoryList({
  categories,
  onEditClick,
}: CategoryListProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Стан для збереження ID розгорнутих категорій (використовуємо Set для швидкості)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const router = useRouter();

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    router.refresh();
  };

  // Функція для відкриття/закриття папки
  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Рекурсивна функція для відмальовування категорії та її дітей
  const renderCategory = (cat: Category, level: number = 0) => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expandedIds.has(cat.id);

    return (
      <React.Fragment key={cat.id}>
        <div
          className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
            level > 0 ? "border-t border-gray-50 bg-gray-50/30" : ""
          }`}
          // Динамічний відступ зліва для створення візуальної "драбинки" вкладеності
          style={{ paddingLeft: `${1 + level * 2}rem`, paddingRight: "1rem" }}
        >
          <div className="flex items-center gap-4">
            {/* Зона для іконки розгортання */}
            <div className="w-6 flex justify-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
                >
                  {isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              ) : (
                <span className="w-4" /> // Пусте місце для вирівнювання, якщо немає підкатегорій
              )}
            </div>

            <div className="w-2.5 h-2.5 rounded-full" />

            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{cat.name}</span>
              <span className="text-xs text-gray-500">
                Сортування:{" "}
                {cat.sortOrder === 0 ? "За замовчуванням" : cat.sortOrder}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEditClick(cat)}
              className="text-sm font-medium text-brand-green-primary hover:text-brand-green-secondary-hover hover:bg-gray-bg px-3 py-1.5 rounded-lg transition-colors"
            >
              Редагувати
            </button>
            <button
              onClick={() => handleDeleteClick(cat)}
              className="hover:bg-gray-bg px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 className="text-red-600 h-5" />
            </button>
          </div>
        </div>

        {/* Якщо категорія має дітей і вона розгорнута — рекурсивно викликаємо цю ж функцію */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {cat.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Існуючі категорії</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Категорій ще немає. Створіть першу!
          </div>
        ) : (
          categories.map((cat) => renderCategory(cat, 0))
        )}
      </div>

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onSuccess={handleModalSuccess}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={{ id: selectedCategory?.id, name: selectedCategory?.name }}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
