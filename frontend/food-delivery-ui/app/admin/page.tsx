"use client";

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

export default function AdminPage() {
  return (
    <>
      <AdminHeader />
      <main className="flex flex-col grow px-std">
        <div className="flex flex-col max-w-page-max-w w-full self-center">
          <h1 className="text-xl font-semibold text-center my-4">
            Керування &quot;Фуді&quot;
          </h1>
          <Link className="flex" href="/admin/categories">
            <Button variant="outline" className="p-7 text-base font-normal">
              <LayoutGrid />
              Категорії
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
