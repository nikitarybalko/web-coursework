"use client";

import React, { Suspense } from "react";
import { CheckCircle2, Home, Receipt } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex flex-col items-center text-center max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-brand-green-primary" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Замовлення прийнято!
      </h1>

      <p className="text-gray-500 mb-8 leading-relaxed">
        Дякуємо за ваше замовлення. Ми вже почали його готувати! Найближчим
        часом наш кур&apos;єр зв&apos;яжеться з вами.
      </p>

      {orderId && (
        <div className="bg-gray-50 w-full py-4 rounded-xl mb-8 flex flex-col items-center border border-gray-100 border-dashed">
          <span className="text-sm text-gray-500 mb-1 uppercase font-semibold tracking-wider">
            Номер замовлення
          </span>
          <span className="text-2xl font-bold text-gray-900">#{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/profile" className="flex-1">
          <Button variant="outline" className="w-full py-6">
            <Receipt className="w-4 h-4 mr-2" />
            Мої замовлення
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button className="w-full py-6">
            <Home className="w-4 h-4 mr-2" />
            На головну
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col grow items-center justify-center bg-gray-50 py-12 px-std min-h-[70vh]">
        <Suspense
          fallback={
            <div className="animate-pulse w-96 h-96 bg-gray-200 rounded-3xl" />
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
