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
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputOutline from "@/components/ui/InputOutline/InputOutline";

// 1. Прибрано isActive
export interface CategoryData {
  id?: number;
  name: string;
  sortOrder: number;
  parentId?: number | null;
  imagePath?: string;
}

interface CategoryFormProps {
  initialData?: CategoryData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CategoryOption {
  id: number;
  name: string;
}

export default function CategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const isEditing = !!initialData;
  const session = useSession();
  const router = useRouter();

  const [mode, setMode] = useState<"select" | "create">(
    isEditing ? "create" : "select",
  );
  const [existingCategories, setExistingCategories] = useState<
    CategoryOption[]
  >([]);
  const [selectedExistingId, setSelectedExistingId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. Прибрано isActive зі стейту
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    parentId: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        sortOrder: initialData.sortOrder,
        parentId: initialData.parentId ? String(initialData.parentId) : "",
      });
      setPreviewUrl(initialData.imagePath || null);
      setMode("create");
    } else {
      setFormData({ name: "", sortOrder: 0, parentId: "" });
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [initialData]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        );
        if (res.ok) {
          const data = await res.json();
          setExistingCategories(data);
        }
      } catch (error) {
        console.error("Помилка завантаження категорій", error);
      }
    }
    if (!isEditing) fetchCategories();
  }, [isEditing]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    const token = session.data?.idToken;

    try {
      if (mode === "select") {
        if (!selectedExistingId) throw new Error("Оберіть категорію зі списку");

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/my/categories/${selectedExistingId}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Не вдалося додати категорію");
        setMessage({
          type: "success",
          text: "Категорію успішно додано до вашого меню!",
        });
      } else {
        if (!imageFile && !previewUrl && !isEditing) {
          throw new Error("Зображення є обов'язковим.");
        }

        let finalImagePath = initialData?.imagePath || "";
        if (imageFile) {
          const fileData = new FormData();
          fileData.append("file", imageFile);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: fileData,
          });
          if (!uploadRes.ok)
            throw new Error("Не вдалося завантажити зображення");
          finalImagePath = (await uploadRes.json()).imagePath;
        }

        // 3. Прибрано isActive з payload
        const payload = {
          name: formData.name,
          imagePath: finalImagePath,
          sortOrder: Number(formData.sortOrder),
          parentId: formData.parentId ? Number(formData.parentId) : null,
        };

        const url = isEditing
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${initialData?.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

        const res = await fetch(url, {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Помилка збереження в базі");
        setMessage({
          type: "success",
          text: isEditing ? "Оновлено!" : "Створено!",
        });
      }

      router.refresh();
      if (onSuccess) setTimeout(onSuccess, 1000);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Виникла помилка." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden">
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
              : "Додати категорію"}
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

        {!isEditing && (
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setMode("select")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === "select" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Обрати з каталогу
            </button>
            <button
              onClick={() => setMode("create")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === "create" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Створити власну
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {mode === "select" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Оберіть категорію зі списку платформи
              </label>
              <select
                required
                value={selectedExistingId}
                onChange={(e) => setSelectedExistingId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green-secondary outline-none bg-white"
              >
                <option value="" disabled>
                  Натисніть для вибору...
                </option>
                {existingCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Якщо ви не знайшли потрібної категорії, перейдіть у вкладку
                &quot;Створити власну&quot;.
              </p>
            </div>
          )}

          {mode === "create" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Назва категорії *
                </label>
                <InputOutline
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зображення *
                </label>
                <div
                  className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden"
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
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-sm font-medium">
                        Завантажити фото
                      </span>
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

              {/* 4. Блок з чекбоксом isActive успішно видалено */}
            </>
          )}

          <div className="flex gap-3 mt-2 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center items-center gap-2 bg-brand-green-secondary hover:bg-brand-green-secondary-hover text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {mode === "select"
                ? "Додати в меню"
                : isEditing
                  ? "Зберегти"
                  : "Створити"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
