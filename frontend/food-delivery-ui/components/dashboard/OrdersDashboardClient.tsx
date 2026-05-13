"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/lib/utils";
import {
  Clock,
  ChefHat,
  Package,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { OrderResponse } from "@/types/Order";

interface OrdersDashboardClientProps {
  initialOrders: OrderResponse[];
  token: string;
}

const STATUSES = [
  {
    value: "PENDING",
    label: "Очікує",
    icon: Clock,
    color: "text-gray-700 bg-gray-100",
  },
  {
    value: "PREPARING",
    label: "Готується",
    icon: ChefHat,
    color: "text-orange-700 bg-orange-100",
  },
  {
    value: "DELIVERING",
    label: "В дорозі",
    icon: Package,
    color: "text-blue-700 bg-blue-100",
  },
  {
    value: "COMPLETED",
    label: "Доставлено",
    icon: CheckCircle2,
    color: "text-green-700 bg-green-100",
  },
  {
    value: "CANCELLED",
    label: "Скасовано",
    icon: XCircle,
    color: "text-red-700 bg-red-100",
  },
];

export default function OrdersDashboardClient({
  initialOrders,
  token,
}: OrdersDashboardClientProps) {
  const [orders, setOrders] = useState<OrderResponse[]>(initialOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // Оптимістичне оновлення UI
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    const success = await updateOrderStatus(orderId, newStatus, token);
    if (!success) {
      // Якщо помилка, повертаємо старі дані (робимо хард-рефреш)
      router.refresh();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Керування замовленнями
        </h2>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Оновити
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">Наразі активних замовлень немає.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleString(
              "uk-UA",
              {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "long",
              },
            );

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
              >
                {/* Хедер картки */}
                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-50 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Замовлення #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>

                  {/* Селект для зміни статусу */}
                  <Select
                    defaultValue={order.status}
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                  >
                    <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            <div className="flex items-center gap-2">
                              <s.icon className="w-4 h-4" />
                              {s.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Інформація про клієнта */}
                <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-700">
                  <p>
                    <strong>Клієнт:</strong> {order.customerEmail}
                  </p>
                  <p>
                    <strong>Адреса:</strong> {order.deliveryAddress}
                  </p>
                </div>

                {/* Список страв */}
                <div className="flex flex-col gap-2 mt-2">
                  <p className="font-semibold text-gray-900 text-sm">
                    Склад замовлення:
                  </p>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-green-primary">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-700">{item.dishName}</span>
                      </div>
                      <span className="text-gray-500 font-medium">
                        {item.priceAtPurchase * item.quantity} ₴
                      </span>
                    </div>
                  ))}
                </div>

                {/* Футер картки */}
                <div className="border-t border-gray-50 pt-4 mt-auto flex justify-between items-center">
                  <span className="font-medium text-gray-500">Сума:</span>
                  <span className="font-bold text-xl text-brand-green-primary">
                    {order.totalPrice} ₴
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
