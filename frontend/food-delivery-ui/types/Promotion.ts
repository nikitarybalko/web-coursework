export interface Promotion {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  restaurantId: number | null;
  restaurantName: string | null;
  validUntil: string | null;
}
