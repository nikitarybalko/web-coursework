export interface Restaurant {
  id: number;
  name: string;
  address: string;
  description: string;
  imagePath: string;
  tags: string[];
  rating: number;
}

export interface CategoryWithDishes {
  id: number;
  name: string;
  dishes: Dish[];
  sortOrder: number;
  isActive: boolean;
  parentId?: number | null;
  imagePath?: string;
}

export interface Dish {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  description: string;
  restaurantId: number;
  restaurantName: string;
}

export interface FetchDishesParams {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
  restaurantId?: string;
  sort?: string;
}
