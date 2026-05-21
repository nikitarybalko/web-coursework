import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "@/types/Categories";
import {
  CategoryWithDishes,
  Dish,
  FetchDishesParams,
  Restaurant,
} from "@/types/Restaurant";
import { PageResponse } from "@/types/Pagination";
import { OrderResponse } from "@/types/Order";
import { Promotion } from "@/types/Promotion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_URL; // http://localhost:8080
  }
  return process.env.NEXT_PUBLIC_API_URL; // /api
};

export async function authFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${getBaseUrl()}${url}`, {
      ...options,
    });

    return response;
  } catch (error) {
    console.error("Could not reach Spring Boot backend:", error);
    throw new Error("Сервер тимчасово недоступний");
  }
}

export async function fetchCategories(limit: number = 0): Promise<Category[]> {
  const baseUrl = `${getBaseUrl()}/categories`;
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

export async function fetchCategoriesByRestaurant(
  restaurantId: string,
): Promise<Category[]> {
  const url = `${getBaseUrl()}/categories/restaurant/${restaurantId}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Помилка завантаження категорій ресторану");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchAllRestaurants(): Promise<Restaurant[]> {
  const url = `${getBaseUrl()}/restaurants`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Помилка HTTP: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Помилка при завантаженні ресторанів:", error);
    return [];
  }
}

export async function fetchRestaurantByOwnerEmail(
  token: string,
): Promise<Restaurant | null> {
  const url = `${getBaseUrl()}/restaurants/owner`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Не авторизовано (401)");
    throw new Error("Помилка завантаження ресторанів");
  }

  return res.json();
}

export async function fetchMenuForRestaurant(
  restaurantId: number,
  token?: string,
): Promise<CategoryWithDishes[]> {
  const url = `${getBaseUrl()}/dishes/menu?restaurantId=${restaurantId}`;

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

export async function fetchAllDishes({
  page = 0,
  size = 12,
  search,
  categoryId,
  restaurantId,
  sort,
}: FetchDishesParams = {}): Promise<PageResponse<Dish>> {
  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (search) query.append("search", search);
  if (categoryId) query.append("categoryId", categoryId);
  if (restaurantId) query.append("restaurantId", restaurantId);

  if (sort === "cheap") {
    query.append("sort", "price,asc");
  } else if (sort === "expensive") {
    query.append("sort", "price,desc");
  }

  const url = `${getBaseUrl()}/dishes?${query.toString()}`;

  try {
    const response = await fetch(url, { cache: "no-store" });

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

export async function getRestaurantById(
  restaurantId: string,
): Promise<Restaurant> {
  const url = `${getBaseUrl()}/restaurants/${restaurantId}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Помилка HTTP: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error("Помилка при завантаженні ресторану:" + error);
  }
}

export async function fetchMyOrders(token: string): Promise<OrderResponse[]> {
  const url = `${getBaseUrl()}/orders/my`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Помилка завантаження замовлень");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchRestaurantOrders(
  token: string,
): Promise<OrderResponse[]> {
  const url = `${getBaseUrl()}/orders/restaurant`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Помилка завантаження замовлень");
    const jsonResponse = await res.json();
    return jsonResponse;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  token: string,
): Promise<boolean> {
  const url = `${getBaseUrl()}/orders/${orderId}/status?status=${status}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch (error) {
    console.error("Помилка оновлення статусу:", error);
    return false;
  }
}

export async function fetchActivePromotions(): Promise<Promotion[]> {
  const url = `${getBaseUrl()}/promotions`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Помилка завантаження акцій:", error);
    return [];
  }
}
