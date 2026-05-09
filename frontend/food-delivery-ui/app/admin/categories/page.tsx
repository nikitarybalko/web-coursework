import AdminHeader from "@/components/admin/AdminHeader";
import React from "react";
import { fetchCategories } from "@/lib/utils";
import CategoryManager from "./CategoryManager";

export default async function CategoriesPage() {
  const categories = await fetchCategories();
  return (
    <>
      <AdminHeader />
      <main className="flex flex-col grow px-std">
        <CategoryManager initialCategories={categories} />
      </main>
    </>
  );
}
