export interface Category {
  id: number;
  name: string;
  imagePath: string;
  sortOrder: number;
  parentId?: number | null;
  children?: Category[];
}
export interface CategorySliderProps {
  categories: Category[];
}
