"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  AlertCircle,
  Check,
  UploadCloud,
  X,
  FolderTree,
  Edit3,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputOutline from "@/components/ui/InputOutline/InputOutline";

export interface AdminCategoryData {
  id?: number;
  name: string;
  sortOrder: number;
  parentId?: number | null;
  imagePath?: string;
}

interface AdminCategoryFormProps {
  initialData?: AdminCategoryData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminCategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: AdminCategoryFormProps) {
  const isEditing = !!initialData;
  const session = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Список категорій для вибору батьківської
  const [parentOptions, setParentOptions] = useState<AdminCategoryData[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    parentId: "", // Зберігаємо як рядок для зручності роботи з <select>
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Завантаження списку всіх категорій для вибору батьківської
  useEffect(() => {
    async function fetchAllCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        if (res.ok) {
          const data = await res.json();
          // Фільтруємо, щоб категорія не могла бути батьком самої себе при редагуванні
          const filtered = isEditing
            ? data.filter((c: AdminCategoryData) => c.id !== initialData?.id)
            : data;
          setParentOptions(filtered);
        }
      } catch (error) {
        console.error("Не вдалося завантажити список категорій", error);
      }
    }
    fetchAllCategories();
  }, [isEditing, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        sortOrder: initialData.sortOrder,
        parentId: initialData.parentId ? String(initialData.parentId) : "",
      });
      setPreviewUrl(initialData.imagePath || null);
    } else {
      setFormData({ name: "", sortOrder: 0, parentId: "" });
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    const token = session.data?.idToken;

    try {
      let finalImagePath = initialData?.imagePath || "";

      if (imageFile) {
        const fileData = new FormData();
        fileData.append("file", imageFile);
        fileData.append("folder", "categories");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });
        if (!uploadRes.ok) throw new Error("Помилка завантаження фото");
        finalImagePath = (await uploadRes.json()).imagePath;
      }

      const payload = {
        name: formData.name,
        imagePath: finalImagePath,
        sortOrder: Number(formData.sortOrder),
        parentId: formData.parentId ? Number(formData.parentId) : null,
      };

      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Помилка при збереженні в базу даних");

      setMessage({
        type: "success",
        text: isEditing
          ? "Зміни збережено успішно!"
          : "Категорію створено успішно!",
      });

      router.refresh();
      if (onSuccess) setTimeout(onSuccess, 1000);
    } catch (error: unknown) {
      if (error instanceof Error)
        setMessage({ type: "error", text: error.message || "Помилка сервера" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 text-brand-green-primary rounded-lg">
            {isEditing ? (
              <Edit3 className="w-5 h-5" />
            ) : (
              <FolderTree className="w-5 h-5" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing
              ? `Редагувати: ${initialData?.name}`
              : "Нова категорія каталогу"}
          </h2>
        </div>
      </div>

      <div className="p-6">
        {message && (
          <div
            className={`p-4 mb-6 rounded-xl flex gap-3 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Назва */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва категорії *
              </label>
              <InputOutline
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Батьківська категорія */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Батьківська категорія
              </label>
              <div className="relative">
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green-secondary outline-none bg-white appearance-none transition-all"
                >
                  <option value="">Немає (Коренева категорія)</option>
                  {parentOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
            </div>

            {/* Порядок сортування */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Порядок сортування (sortOrder)
              </label>
              <InputOutline
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>

          {/* Зображення */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зображення категорії
            </label>
            <div
              className="relative h-40 border-2 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden transition-all flex flex-col items-center justify-center"
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-full bg-white">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                  <span className="text-sm font-medium">Завантажити фото</span>
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

          {/* Кнопки */}
          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-brand-green-secondary text-white rounded-xl font-medium hover:bg-brand-green-secondary-hover transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isEditing ? "Оновити" : "Створити"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
