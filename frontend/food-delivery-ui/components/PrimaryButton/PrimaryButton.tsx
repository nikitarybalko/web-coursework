import Link from "next/link";
import React from "react";

interface ButtonProps {
  href: string;
  text: string;
}

export default function PrimaryButton(props: ButtonProps) {
  return (
    <Link
      className="text-center text-white font-semibold text-sm py-2 px-3 bg-brand-green-secondary hover:bg-brand-green-secondary-hover transition duration-300 rounded-lg"
      href={props.href}
    >
      {props.text}
    </Link>
  );
}
