"use client";

import { useSession } from "next-auth/react";
import Logo from "../ui/Logo/Logo";
import Link from "next/link";
import Image from "next/image";
import AccountIcon from "@/public/img/icons/account-circle.svg";
import { Button } from "../ui/button";

export default function AdminHeader() {
  const { data: session } = useSession();
  const icon = session?.user.image ?? AccountIcon;
  return (
    <header className="flex flex-col w-full bg-gray-bg items-center px-std">
      <div className="flex items-center justify-between py-2 w-full max-w-page-max-w">
        <div className="flex items-center gap-5">
          <Logo />
          <Link href="/admin" className="font-medium">
            Адмін-панель
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {session ? (
            <Link
              href="/profile"
              className="flex items-center flex-nowrap text-nowrap gap-2"
            >
              <Image
                width={40}
                height={40}
                src={icon}
                alt="Account icon"
                className="rounded-full p-1"
              />
              <span className="text-sm font-medium">{session.user?.name}</span>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Увійти</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
