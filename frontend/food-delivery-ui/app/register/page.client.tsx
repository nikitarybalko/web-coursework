"use client";

import React from "react";
import { redirect, useRouter } from "next/navigation";
import { Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import Card from "@/components/ui/Card/Card";
import Logo from "@/components/ui/Logo/Logo";
import Input from "@/components/ui/Input/Input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton/GoogleSignInButton";
import { useSession } from "next-auth/react";
import { registerSchema, RegisterSchema } from "../schemas/register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterClient() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    const payload = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phoneNumber: data.phone,
    };
    console.log("Sending to Spring Boot: ", payload);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/authentication/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        let errorMessage = "Виникла несподівана помилка";

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();

          errorMessage = errorData.MESSAGE || errorData.message || errorMessage;
        } else {
          errorMessage = await res.text();
        }

        if (
          errorMessage.toLowerCase().includes("email") ||
          errorMessage.toLowerCase().includes("email")
        ) {
          setError("email", {
            type: "server",
            message: errorMessage,
          });
        } else {
          setError("root", {
            type: "server",
            message: errorMessage,
          });
        }

        return;
      }

      console.log("Success!");

      router.push("/login");
    } catch (error) {
      setError("root", {
        type: "network",
        message: "Неможливо підключитись до сервера",
      });
    }
  };

  const { data: session } = useSession();
  if (session) {
    redirect("/profile");
  }

  return (
    <div className="bg-gray-bg min-h-screen">
      <header className="flex items-center justify-between py-2 px-6 w-full bg-gray-bg">
        <Logo />
      </header>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Card>
          <form
            className="p-8 flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <UserPlus className="text-brand-green-primary w-14" />
            <span className="text-xl font-semibold mt-7 text-center">
              Зареєструватись
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
              <Input
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                icon={<Lock size={18} className="text-placeholder" />}
                type="password"
                placeholder="Підтвердіть пароль"
              />
              <Input
                {...register("fullName")}
                error={errors.fullName?.message}
                icon={<User size={18} className="text-placeholder" />}
                type="text"
                placeholder="Ім'я"
              />
              <Input
                type="tel"
                icon={<Phone size={18} className="text-placeholder" />}
                placeholder="+380XXXXXXXXXX"
                {...register("phone", {
                  pattern: {
                    value: /^\+380\d{10}$/,
                    message: "Phone number must be in format +380XXXXXXXXXX",
                  },
                })}
                error={errors.phone?.message}
              />

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Створення акаунту..." : "Створити акаунт"}
              </Button>

              <div className="flex items-center gap-4 w-full text-placeholder">
                <hr className="flex-1 border-t border-dashed border-gray-300 " />

                <span className="text-sm">Або</span>

                <hr className="flex-1 border-t border-dashed border-gray-300" />
              </div>

              <GoogleSignInButton disabled={isSubmitting} />

              <div className="text-sm text-center">
                Маєте акаунт?{" "}
                <Link
                  className="text-blue-800 border-b border-transparent hover:border-b-blue-800"
                  href="/login"
                >
                  Увійдіть!
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
