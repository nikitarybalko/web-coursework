import { Metadata } from "next";
import React from "react";
import LoginClient from "./page.client";

export const metadata: Metadata = {
  title: "Фуді - увійти",
};

export default function Login() {
  return <LoginClient />;
}
