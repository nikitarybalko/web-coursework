"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Loader2,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const { data: session } = useSession();

  // Уникаємо гідратації
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("card");

  // Стани для процесу оформлення
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (session?.user?.name) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name,
        phone: session.user.phoneNumber,
      }));
    }
  }, [session]);

  // Якщо кошик порожній, не дозволяємо бути на цій сторінці
  useEffect(() => {
    if (mounted && items.length === 0 && paymentStatus !== "success") {
      router.push("/food");
    }
  }, [mounted, items.length, router, paymentStatus]);

  if (!mounted || items.length === 0) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Імітація оплати карткою
      if (paymentMethod === "card") {
        setPaymentStatus("processing");
        // Чекаємо 2.5 секунди для імітації банківського шлюзу
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setPaymentStatus("success");
      }

      // 2. Формуємо payload для нашого бекенду
      console.log("items: ", items);
      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        restaurantId: items[0].restaurantId,
        items: items.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
        })),
      };

      // 3. Відправляємо на бекенд
      const token = session?.idToken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Не вдалося створити замовлення");

      const orderData = await res.json();

      // 4. Очищаємо кошик і переходимо на сторінку успіху
      clearCart();
      router.push(`/checkout/success?orderId=${orderData.id}`);
    } catch (err) {
      console.error(err);
      setError("Виникла помилка при оформленні. Спробуйте ще раз.");
      setPaymentStatus("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col grow bg-gray-50 pt-8 px-std pb-20">
        <div className="max-w-4xl w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Оформлення замовлення
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ліва колонка: Форма */}
            <div className="flex-1 space-y-6">
              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
              >
                <h2 className="text-xl font-semibold mb-4">Контактні дані</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ім&apos;я
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-green-primary outline-none transition-all"
                      placeholder="Ваше ім'я"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-green-primary outline-none transition-all"
                      placeholder="+380..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адреса доставки
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-green-primary outline-none transition-all"
                      placeholder="Вулиця, будинок, квартира"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4 pt-4 border-t">
                  Оплата
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "card" ? "border-brand-green-primary bg-brand-green-primary/5 text-brand-green-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-medium">Карткою онлайн</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("cash")}
                    className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "cash" ? "border-brand-green-primary bg-brand-green-primary/5 text-brand-green-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="font-medium">Готівкою кур&apos;єру</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Права колонка: Чек */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Ваше замовлення</h2>
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-600 line-clamp-1">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium whitespace-nowrap ml-4">
                        {item.price * item.quantity} ₴
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>До сплати:</span>
                    <span className="text-brand-green-primary">
                      {getTotalPrice()} ₴
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm mb-4 text-center">
                    {error}
                  </p>
                )}

                <Button
                  form="checkout-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `Оплатити ${getTotalPrice()} ₴`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Модальне вікно імітації оплати */}
        {paymentStatus !== "idle" && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full border border-gray-100">
              {paymentStatus === "processing" ? (
                <>
                  <div className="w-16 h-16 border-4 border-gray-100 border-t-brand-green-primary rounded-full animate-spin mb-6" />
                  <h3 className="text-xl font-bold mb-2">Обробка платежу...</h3>
                  <p className="text-gray-500">
                    Будь ласка, не закривайте сторінку. Зв&apos;язуємось із
                    банком.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Оплачено!</h3>
                  <p className="text-gray-500">
                    Перенаправляємо на сторінку замовлення...
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
