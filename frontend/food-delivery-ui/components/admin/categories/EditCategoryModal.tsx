"use client";

import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputOutline from "@/components/ui/InputOutline/InputOutline";
import { useSession } from "next-auth/react";

// Типізація пропсів модального вікна
interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Дані категорії, яку ми зараз редагуємо
  category: {
    id: number;
    name: string;
    sortOrder: number;
    parentId?: number | null;
  } | null;
  onSuccess: () => void; // Функція для оновлення списку після збереження
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  // Коли модалка відкривається і ми отримуємо категорію, заповнюємо форму
  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name: category.name,
        sortOrder: category.sortOrder,
      });
    }
  }, [category, isOpen]);

  // Якщо модалка закрита, взагалі її не рендеримо
  if (!isOpen || !category) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = session.data?.idToken;
    try {
      // Робимо PUT запит на бекенд для оновлення
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!res.ok) throw new Error("Помилка оновлення");

      onSuccess(); // Оновлюємо таблицю категорій на фоні
      onClose(); // Закриваємо модалку
    } catch (error) {
      console.error(error);
      alert("Не вдалося оновити категорію");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Напівпрозорий фон (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Саме модальне вікно */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Хедер модалки */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Редагувати категорію
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва
            </label>
            <InputOutline
              type="text"
              value={formData.name}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
              ) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сортування
            </label>
            <InputOutline
              type="number"
              value={formData.sortOrder}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
              ) =>
                setFormData({ ...formData, sortOrder: Number(e.target.value) })
              }
            />
          </div>

          {/* Футер з кнопками */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Скасувати
            </Button>
            <Button
              type="submit"
              className="disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                "Збереження..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Зберегти
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
