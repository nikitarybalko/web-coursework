import React from "react";
import { MapPin } from "lucide-react";

import PrimaryButton from "../PrimaryButton/PrimaryButton";
import SearchToggle from "../SearchToggle/SearchToggle";
import Logo from "../Logo/Logo";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-2 px-10 w-full bg-gray-bg">
      <div className="flex items-center gap-8">
        <Logo />

        <button className="hidden md:flex items-center gap-1 text-gray-800 hover:text-black">
          <MapPin size={20} className="text-brand-green-primary" />
          <span className="text-sm">Ваше місцезнаходження</span>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <SearchToggle />

        <PrimaryButton href="/login" text="Увійти" />
      </div>
    </header>
  );
}
