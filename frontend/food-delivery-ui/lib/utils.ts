import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "@/types/Categories";
import { CategoryWithDishes, Dish, Restaurant } from "@/types/Restaurant";
import { PageResponse } from "@/types/Pagination";
import { useSession } from "next-auth/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function authFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
    });

    return response;
  } catch (error) {
    console.error("Could not reach Spring Boot backend:", error);
    throw new Error("Сервер тимчасово недоступний");
  }
}

export async function fetchCategories(limit: number = 0): Promise<Category[]> {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
  const url = limit ? `${baseUrl}?limit=${limit}` : baseUrl;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Помилка HTTP: ${response.status} ${response.statusText}`,
      );
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Помилка при завантаженні категорій:", error);
    return [];
  }
}

export async function fetchRestaurantByOwnerEmail(
  email: string,
): Promise<Restaurant | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants?email=${email}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Помилка HTTP: ${response.status} ${response.statusText}`,
      );
    }

    const restaurant = await response.json();
    return restaurant;
  } catch (error) {
    console.error("Помилка при завантаженні ресторану:", error);
    return null;
  }
}

export async function fetchMenuForRestaurant(
  restaurantId: number,
  token?: string,
): Promise<CategoryWithDishes[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/dishes/menu?restaurantId=${restaurantId}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(
        `Помилка HTTP: ${response.status} ${response.statusText}`,
      );
    }

    const menu = await response.json();
    return menu;
  } catch (error) {
    console.error("Помилка при завантаженні меню:", error);
    return [];
  }
}

export async function fetchAllDishes(
  page: number = 0,
  size: number = 12,
  search?: string,
  categoryId?: string,
): Promise<PageResponse<Dish>> {
  console.log("In utils.ts: ", categoryId);
  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) query.append("search", search);
  if (categoryId) query.append("categoryId", categoryId);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/dishes?${query.toString()}`;
  console.log("Resulting URL: ", url);
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Помилка HTTP: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error("Помилка при завантаженні меню:" + error);
  }
}
