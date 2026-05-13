"use client";

import React, { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, getTotalPrice } =
    useCartStore();

  // Уникаємо помилки гідратації (Hydration Mismatch) у Next.js
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <>
      {/* Затемнення фону */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Сама панель */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Хедер кошика */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-brand-green-primary" />
            Ваше замовлення
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Список товарів */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
              <ShoppingBag size={48} className="text-gray-300" />
              <p>Ваш кошик порожній</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl relative overflow-hidden shrink-0">
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                    {item.name}
                  </h4>
                  <p className="font-bold text-brand-green-primary">
                    {item.price} ₴
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-lg transition-colors shadow-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-lg transition-colors shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Футер з підсумком */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Сума:</span>
              <span className="text-xl font-bold">{getTotalPrice()} ₴</span>
            </div>

            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full text-lg py-6">
                Оформити замовлення
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
