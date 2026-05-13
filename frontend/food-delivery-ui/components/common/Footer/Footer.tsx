import Logo from "@/components/ui/Logo/Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-std">
      <div className="max-w-page-max-w mx-auto self-center w-full flex flex-col">
        {/* Основна сітка з посиланнями */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* 1. Блок з логотипом та описом */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-gray-400 leading-relaxed">
              Швидка доставка вашої улюбленої їжі з найкращих ресторанів міста.
              Гаряче, смачно та вчасно.
            </p>
          </div>

          {/* 2. Навігація - Компанія */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-1">Компанія</h3>
            <Link
              href="/about"
              className="text-sm hover:text-white transition-colors duration-200"
            >
              Про нас
            </Link>
            <Link
              href="/contacts"
              className="text-sm hover:text-white transition-colors duration-200"
            >
              Контакти
            </Link>
            <Link
              href="/blog"
              className="text-sm hover:text-white transition-colors duration-200"
            >
              Блог
            </Link>
          </div>

          {/* 3. Навігація - Співпраця */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-1">Співпраця</h3>
            <Link
              href="/partners"
              className="text-sm hover:text-white transition-colors duration-200"
            >
              Додати заклад
            </Link>
            <Link
              href="/couriers"
              className="text-sm hover:text-white transition-colors duration-200"
            >
              Стати кур&apos;єром
            </Link>
            <Link
              href="/corporate"
              className="text-sm hover:text-white transition-colors duration-200"
            >
              Корпоративним клієнтам
            </Link>
          </div>

          {/* 4. Завантаження додатку */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-medium mb-1">Завантажити додаток</h3>
            <p className="text-sm text-gray-400 mb-2">
              Замовляйте в один клік зі смартфона
            </p>
            {/* Заглушки для кнопок сторів */}
            <div className="flex flex-col gap-2">
              <button className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border border-gray-700 w-fit">
                App Store
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border border-gray-700 w-fit">
                Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Лінія розділення */}
        <hr className="border-gray-800 mb-6" />

        {/* Нижній рядок (Копірайт та легальна інформація) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Фуді. Всі права захищено.</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Політика конфіденційності
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
