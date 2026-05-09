import Header from "@/components/common/Header/Header";
import { getServerSession } from "next-auth";
import AccountIcon from "@/public/img/icons/account-circle.svg";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import Card from "@/components/ui/Card/Card";
import { Mail, Phone, User } from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton/LogoutButton";
import EditProfileDialog from "@/components/common/EditProfileDialog/EditProfileDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const icon = session?.user.image ?? AccountIcon;

  return (
    <div className="bg-gray-bg min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col grow px-std">
        <div className="flex grow bg-background p-std rounded-t-lg w-full max-w-page-max-w self-center">
          <div className="flex flex-col gap-y-std w-full max-w-sm">
            <div className="flex items-center gap-x-5">
              <Image
                width={60}
                height={60}
                src={icon}
                alt="Account icon"
                className="rounded-full"
              />
              <h1 className="text-xl font-semibold">Мій профіль</h1>
            </div>
            <div className="flex flex-col gap-y-5">
              <Card>
                <div className="flex items-center">
                  <Mail className="mr-4" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Email</span>
                    <span>{session.user?.email}</span>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="mr-4" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Ім&apos;я</span>
                      <span>{session.user?.name}</span>
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
                    <Phone className="mr-4" />
                    <div className="flex flex-col">
                      <span className="font-semibold">Номер телефону</span>
                      <span>{session.user?.phoneNumber ?? "Не задано"}</span>
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
              {session.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline">Адмін-панель</Button>
                </Link>
              )}
              {session.role === "RESTAURANT" && (
                <Link href="/dashboard/menu">
                  <Button variant="outline">Керування закладом</Button>
                </Link>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
