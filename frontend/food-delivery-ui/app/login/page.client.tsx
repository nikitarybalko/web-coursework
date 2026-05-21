"use client";

import Card from "@/components/ui/Card/Card";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton/GoogleSignInButton";
import Input from "@/components/ui/Input/Input";
import Logo from "@/components/ui/Logo/Logo";
import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { loginSchema, LoginSchema } from "../schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function LoginClient() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile");
    }
  }, [status, router]);

  const onSubmit = async (data: LoginSchema) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("root", {
        type: "server",
        message: "Неправильний email або пароль",
      });
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <div className="bg-gray-bg min-h-screen">
      <header className="flex items-center justify-between py-2 px-6 w-full bg-gray-bg">
        <Logo />
      </header>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Card>
          <form
            className="p-8 flex flex-col items-center"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <LogIn className="text-brand-green-primary w-14" />
            <span className="text-xl font-semibold mt-7 text-center">
              Увійти
            </span>
            <div className="flex flex-col mt-7 gap-2.5">
              <Input
                {...register("email")}
                error={errors.email?.message}
                icon={<Mail size={18} className="text-placeholder" />}
                type="email"
                placeholder="Email"
              />
              <Input
                {...register("password")}
                error={errors.password?.message}
                icon={<Lock size={18} className="text-placeholder" />}
                type="password"
                placeholder="Пароль"
              />

              <Button type="submit" className="mt-2">
                {isSubmitting ? "Триває вхід..." : "Почати"}
              </Button>

              <div className="flex items-center gap-4 w-full text-placeholder">
                <hr className="flex-1 border-t border-dashed border-gray-300 " />

                <span className="text-sm">Або</span>

                <hr className="flex-1 border-t border-dashed border-gray-300" />
              </div>

              <GoogleSignInButton />

              <div className="text-sm text-center">
                Не маєте акаунту?{" "}
                <Link
                  className="text-blue-800 border-b border-transparent hover:border-b-blue-800"
                  href="/register"
                >
                  Зареєструйтесь!
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
