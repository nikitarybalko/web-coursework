export interface OrderItemResponse {
  id: number;
  dishId: number;
  dishName: string;
  priceAtPurchase: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  restaurantId: number;
  customerEmail: string;
  deliveryAddress: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}
