"use client";

import Image from "next/image";
import LogoImage from "@/public/img/icons/foodie-logo-white.svg";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { SidebarLink } from "@/components/dashboard/SidebarLink";
import { useSession } from "next-auth/react";
import AccountIcon from "@/public/img/icons/account-circle.svg";
import {
  RestaurantProvider,
  useRestaurant,
} from "../providers/RestaurantContext";

const DashboardHeader = () => {
  const { data: session } = useSession();
  const icon = session?.user?.image ?? AccountIcon;
  const { restaurant, isLoading } = useRestaurant();

  return (
    <div className="flex justify-between items-center bg-white px-10 py-3 shadow-sm z-10">
      <span className="flex items-center text-lg font-semibold text-gray-800">
        {isLoading
          ? "Завантаження..."
          : (restaurant?.name ?? "Ресторан не знайдено")}
      </span>
      <Image
        width={40}
        height={40}
        src={icon}
        alt="Account icon"
        className="rounded-full border border-gray-200 p-0.5"
      />
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RestaurantProvider>
      <div className="flex h-screen w-screen bg-gray-bg">
        <aside className="flex flex-col w-60 bg-brand-green-secondary text-white p-4">
          <div className="flex items-center justify-center">
            <div className="text-2xl font-semibold text-brand-white-primary flex whitespace-nowrap">
              <Image src={LogoImage} alt="Logo" />
              <span>Фуді</span>
            </div>
          </div>
          <nav className="flex flex-col gap-2 flex-1 pt-4">
            <SidebarLink href="/dashboard/menu" iconName="menu" label="Меню" />
            <SidebarLink
              href="/dashboard/main"
              iconName="dashboard"
              label="Робочий стіл"
            />
            <SidebarLink
              href="/dashboard/orders"
              iconName="orders"
              label="Замовлення"
            />
            <SidebarLink
              href="/dashboard/reviews"
              iconName="reviews"
              label="Відгуки"
            />
            <SidebarLink
              href="/dashboard/settings"
              iconName="settings"
              label="Налаштування"
            />
          </nav>

          <div className="mt-auto">
            <Link href="/">
              <button className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 w-full rounded-lg transition-colors">
                <LogOut size={22} />
                <span className="text-sm">Вихід</span>
              </button>
            </Link>
          </div>
        </aside>

        <main className="flex flex-col flex-1 overflow-hidden">
          <DashboardHeader />
          {/* Контейнер для сторінок зі скролом */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </RestaurantProvider>
  );
}
