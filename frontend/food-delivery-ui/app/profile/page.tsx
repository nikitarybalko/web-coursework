import Header from "@/components/common/Header/Header";
import { getServerSession } from "next-auth";
import AccountIcon from "@/public/img/icons/account-circle.svg";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import Card from "@/components/ui/Card/Card";
import { Mail, Phone, User, ShoppingBag } from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton/LogoutButton";
import EditProfileDialog from "@/components/common/EditProfileDialog/EditProfileDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchMyOrders } from "@/lib/utils";
import OrderHistoryCard from "@/components/profile/OrderHistoryCard";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session || !session.idToken) {
    redirect("/login");
  }

  const icon = session?.user.image ?? AccountIcon;
  const orders = await fetchMyOrders(session.idToken);

  return (
    <div className="bg-gray-bg min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col grow px-std py-8">
        {/* ГОЛОВНИЙ КОНТЕЙНЕР: Тепер це flex-col, щоб кнопка виходу могла впасти вниз */}
        <div className="flex flex-col grow bg-background p-std rounded-2xl w-full max-w-page-max-w self-center shadow-sm">
          {/* ОБГОРТКА ДЛЯ ДВОХ КОЛОНОК */}
          <div className="flex flex-col lg:flex-row gap-8 w-full mb-8">
            {/* ЛІВА КОЛОНКА: Дані профілю */}
            <div className="flex flex-col gap-y-std w-full lg:max-w-sm shrink-0">
              <div className="flex items-center gap-x-5 mb-2">
                <Image
                  width={60}
                  height={60}
                  src={icon}
                  alt="Account icon"
                  className="rounded-full shadow-sm"
                />
                <h1 className="text-2xl font-bold text-gray-900">
                  Мій профіль
                </h1>
              </div>

              <div className="flex flex-col gap-y-4">
                <Card>
                  <div className="flex items-center">
                    <Mail className="mr-4 text-brand-green-primary" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">Email</span>
                      <span className="text-gray-600">
                        {session.user?.email}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="mr-4 text-brand-green-primary" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          Ім&apos;я
                        </span>
                        <span className="text-gray-600">
                          {session.user?.name}
                        </span>
                      </div>
                    </div>
                    <EditProfileDialog
                      title="Зміна імені"
                      fieldLabel="Нове ім'я"
                      fieldKey="fullName"
                      defaultValue={session.user?.name ?? ""}
                    />
                  </div>
                </Card>

                <Card>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Phone className="mr-4 text-brand-green-primary" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          Номер телефону
                        </span>
                        <span className="text-gray-600">
                          {session.user?.phoneNumber ?? "Не задано"}
                        </span>
                      </div>
                    </div>
                    <EditProfileDialog
                      title="Зміна номеру телефону"
                      fieldLabel="Новий номер телефону"
                      fieldKey="phoneNumber"
                      defaultValue={session.user?.phoneNumber ?? ""}
                    />
                  </div>
                </Card>

                {/* Кнопки керування для адмінів та ресторанів */}
                {(session.role === "ADMIN" ||
                  session.role === "RESTAURANT") && (
                  <div className="flex flex-col gap-3 mt-4">
                    {session.role === "ADMIN" && (
                      <Link href="/admin">
                        <Button variant="outline" className="w-full">
                          Адмін-панель
                        </Button>
                      </Link>
                    )}
                    {session.role === "RESTAURANT" && (
                      <Link href="/dashboard/menu">
                        <Button variant="outline" className="w-full">
                          Керування закладом
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ПРАВА КОЛОНКА: Історія замовлень */}
            <div className="flex flex-col flex-1 gap-y-5 lg:pl-8 lg:border-l border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="w-6 h-6 text-brand-green-primary" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Історія замовлень
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-16 px-4 text-center h-full">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    У вас ще немає замовлень
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Схоже, ви ще нічого не замовляли. Перейдіть до меню, щоб
                    обрати щось смачненьке!
                  </p>
                  <Link href="/food">
                    <Button>Перейти до меню</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {orders.map((order) => (
                    <OrderHistoryCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* НИЖНІЙ БЛОК: Кнопка виходу */}
          {/* Клас mt-auto притискає цей блок до самого низу білого контейнера */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex w-full">
            {/* Ширина співпадає з лівою колонкою (lg:max-w-sm) для візуальної гармонії */}
            <div className="w-full lg:max-w-sm">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
