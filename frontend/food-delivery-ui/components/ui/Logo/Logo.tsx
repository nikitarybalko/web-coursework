import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/public/img/icons/foodie-logo-green.svg";
import React from "react";

export default function Logo() {
  return (
    <Link
      className="text-2xl font-semibold text-brand-green-primary flex whitespace-nowrap"
      href="/"
    >
      <Image src={LogoImage} alt="Logo" />
      <span>Фуді</span>
    </Link>
  );
}
