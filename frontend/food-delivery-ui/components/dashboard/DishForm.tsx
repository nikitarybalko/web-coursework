"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  AlertCircle,
  Check,
  UploadCloud,
  X,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CategoryWithDishes, Dish } from "@/types/Restaurant";

interface DishFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Dish | null;
  categories: CategoryWithDishes[];
  restaurantId?: number;
  initialCategoryId?: number;
  onSuccess: () => void;
}

export default function DishForm({
  isOpen,
  onClose,
  initialData,
  categories,
  restaurantId,
  initialCategoryId,
  onSuccess,
}: DishFormProps) {
  const isEditing = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Стейт форми
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  // Стейт для картинки
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();

  // Синхронізація з initialData
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description,
          price: String(initialData.price),
          categoryId: initialCategoryId ? String(initialCategoryId) : "",
        });
        setPreviewUrl(initialData.imagePath || null);
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          categoryId: initialCategoryId
            ? String(initialCategoryId)
            : categories[0]?.id.toString() || "",
        });
        setPreviewUrl(null);
      }
      setImageFile(null);
      setMessage(null);
    }
  }, [isOpen, initialData, categories, initialCategoryId]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    setIsLoading(true);
    setMessage(null);

    try {
      let finalImagePath = initialData?.imagePath || "";

      // 1. Завантажуємо фото, якщо є нове
      if (imageFile) {
        const fileData = new FormData();
        fileData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });
        if (!uploadRes.ok) throw new Error("Не вдалося завантажити зображення");
        finalImagePath = (await uploadRes.json()).imagePath;
      }

      // 2. Формуємо payload
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imagePath: finalImagePath,
        restaurantId: restaurantId,
        categoryIds: formData.categoryId ? [Number(formData.categoryId)] : [],
      };

      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/dishes/${initialData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/dishes`;

      const token = session.data?.idToken;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Помилка збереження");

      onSuccess();
      onClose();
    } catch (error) {
      setMessage({ type: "error", text: "Помилка при збереженні." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-brand-green-secondary/5">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-brand-green-primary" />
            {isEditing ? "Редагувати страву" : "Нова страва"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div
              className={`p-4 mb-4 rounded-xl flex gap-3 ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
            >
              {message.type === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Check className="w-5 h-5" />
              )}
              <span className="font-medium text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Назва страви *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-green-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ціна (₴) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-green-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категорія
                </label>
                <select
                  required
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-brand-green-primary outline-none"
                >
                  <option value="" disabled>
                    Оберіть...
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис
              </label>
              <textarea
                name="description"
                maxLength={255}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-green-primary outline-none max-h-40"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Зображення
              </label>
              <div
                className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden"
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full bg-white">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <UploadCloud className="w-6 h-6 mb-1 text-gray-400" />
                    <span className="text-xs">Натисніть для завантаження</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl border font-medium text-gray-700 hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-brand-green-secondary text-white font-medium hover:bg-brand-green-secondary-hover flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isEditing ? "Зберегти" : "Створити"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
