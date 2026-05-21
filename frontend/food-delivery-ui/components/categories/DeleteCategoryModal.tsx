"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: number | undefined;
    name: string | undefined;
  } | null;
  onSuccess: () => void;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: DeleteCategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    const token = session.data?.idToken;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Помилка видалення");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Не вдалося видалити категорію. Перевірте з'єднання з сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-red-50/50">
          <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Видалити категорію
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Ви впевнені, що хочете видалити категорію{" "}
            <strong>«{category.name}»</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Цю дію неможливо буде скасувати. Якщо ця категорія містить страви
            вони також будуть видалені, а підкатегорії стануть самостійними.
          </p>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0 mt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Скасувати
          </Button>

          <Button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-70"
          >
            {isLoading ? (
              "Видалення..."
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Видалити
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
