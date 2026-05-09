"use client";
import React from "react";
import { MapPin } from "lucide-react";
import AccountIcon from "@/public/img/icons/account-circle.svg";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logo from "@/components/ui/Logo/Logo";
import SearchToggle from "@/components/ui/SearchToggle/SearchToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();
  const icon = session?.user.image ?? AccountIcon;

  return (
    <header className="flex flex-col w-full bg-gray-bg items-center px-std">
      <div className="flex items-center justify-between py-2 w-full max-w-page-max-w">
        <div className="flex items-center gap-8">
          <Logo />

          <button className="hidden md:flex items-center gap-1 text-gray-800 hover:text-black">
            <MapPin size={20} className="text-brand-green-primary" />
            <span className="text-sm">Ваше місцезнаходження</span>
          </button>
        </div>

        <div className="flex items-center gap-8">
          <SearchToggle />

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
