import React from "react";
import { Clock, Package, CheckCircle2, XCircle, ChefHat } from "lucide-react";
import { OrderResponse } from "@/types/Order";

// Допоміжна функція для мапінгу статусів
const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        text: "Очікує",
        color: "bg-gray-100 text-gray-700",
        icon: Clock,
      };
    case "PREPARING":
      return {
        text: "Готується",
        color: "bg-orange-100 text-orange-700",
        icon: ChefHat,
      };
    case "DELIVERING":
      return {
        text: "В дорозі",
        color: "bg-blue-100 text-blue-700",
        icon: Package,
      };
    case "COMPLETED":
      return {
        text: "Доставлено",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle2,
      };
    case "CANCELLED":
      return {
        text: "Скасовано",
        color: "bg-red-100 text-red-700",
        icon: XCircle,
      };
    default:
      return {
        text: status,
        color: "bg-gray-100 text-gray-700",
        icon: Package,
      };
  }
};

export default function OrderHistoryCard({ order }: { order: OrderResponse }) {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const formattedDate = new Date(order.createdAt).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-4">
        <div>
          <span className="text-sm text-gray-500 font-medium">
            Замовлення #{order.id}
          </span>
          <p className="text-gray-900 text-sm mt-0.5">{formattedDate}</p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit ${statusConfig.color}`}
        >
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-semibold">{statusConfig.text}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {item.quantity}x
              </span>
              <span className="text-gray-700">{item.dishName}</span>
            </div>
            <span className="text-gray-500">
              {item.priceAtPurchase * item.quantity} ₴
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
        <span className="font-medium text-gray-600">Загальна сума:</span>
        <span className="font-bold text-lg text-brand-green-primary">
          {order.totalPrice} ₴
        </span>
      </div>
    </div>
  );
}
