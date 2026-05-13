import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-bg px-4">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-50 text-brand-green-primary rounded-full flex items-center justify-center mb-6">
          <SearchX size={40} />
        </div>

        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Сторінку не знайдено
        </h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Здається, ця сторінка загубилася десь на кухні або її вже з&apos;їли.
          Давайте повернемося туди, де є щось смачненьке!
        </p>

        <Link
          href="/" // Або "/dashboard", якщо це помилка всередині адмінки
          className="w-full flex justify-center bg-brand-green-secondary hover:bg-brand-green-secondary-hover text-white font-medium py-3.5 px-6 rounded-xl transition-colors"
        >
          На головну сторінку
        </Link>
      </div>
    </div>
  );
}
