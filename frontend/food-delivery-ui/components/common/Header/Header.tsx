"use client";
import React, { useEffect, useState } from "react";
import { MapPin, ShoppingCart } from "lucide-react";
import AccountIcon from "@/public/img/icons/account-circle.svg";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logo from "@/components/ui/Logo/Logo";
import SearchToggle from "@/components/ui/SearchToggle/SearchToggle";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "../Cart/CartDrawer";

export default function Header() {
  const { data: session } = useSession();
  const icon = session?.user.image ?? AccountIcon;

  const { openCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex flex-col w-full bg-gray-bg items-center px-std">
      <CartDrawer />
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

          <button
            onClick={openCart}
            className="relative p-2 text-gray-700 hover:text-black transition-colors"
          >
            <ShoppingCart size={24} />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute 0 top-0 right-0 translate-x-1 -translate-y-1 bg-brand-green-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-bg">
                {getTotalItems()}
              </span>
            )}
          </button>

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
