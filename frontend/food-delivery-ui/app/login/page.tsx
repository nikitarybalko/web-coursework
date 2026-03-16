import Card from "@/components/Card/Card";
import GoogleSignInButton from "@/components/GoogleSignInButton/GoogleSignInButton";
import Input from "@/components/Input/Input";
import Logo from "@/components/Logo/Logo";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="bg-gray-bg min-h-screen">
      <header className="flex items-center justify-between py-2 px-6 w-full bg-gray-bg">
        <Logo />
      </header>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Card>
          <div className="p-8 flex flex-col items-center">
            <LogIn className="text-brand-green-primary w-14" />
            <span className="text-xl font-semibold mt-7 text-center">
              Увійти чи зареєструватись
            </span>
            <div className="flex flex-col mt-7 gap-2.5">
              <Input
                icon={<Mail size={18} className="text-placeholder" />}
                type="email"
                placeholder="Email"
              />
              <Input
                icon={<Lock size={18} className="text-placeholder" />}
                type="password"
                placeholder="Password"
              />
              <Link
                href="/forgot-pass"
                className="flex self-end text-sm font-light border-b border-transparent hover:border-b-black"
              >
                Забули пароль?
              </Link>
              <PrimaryButton href="/" text="Почати" />
              {/* TODO POST REQUEST!!! */}
              <GoogleSignInButton />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
