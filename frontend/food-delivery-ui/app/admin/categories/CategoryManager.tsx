"use client";

import CategoryForm, {
  CategoryData,
} from "@/components/admin/categories/CategoryForm";
import CategoryList from "@/components/admin/categories/CategoryList";
import { Category } from "@/types/Categories";
import React, { useState } from "react";

interface CategoryManagerProps {
  initialCategories: Category[];
}

export default function CategoryManager({
  initialCategories,
}: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );
  const clearSelection = () => {
    setEditingCategory(null);
  };
  return (
    <div className="flex flex-col max-w-page-max-w w-full self-center gap-2">
      <CategoryForm
        initialData={editingCategory}
        onSuccess={clearSelection}
        onCancel={clearSelection}
      />
      <CategoryList
        categories={initialCategories}
        onEditClick={(category) => setEditingCategory(category)}
      />
    </div>
  );
}
