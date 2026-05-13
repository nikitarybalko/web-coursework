import { Metadata } from "next";
import React from "react";
import RegisterClient from "./page.client";

export const metadata: Metadata = {
  title: "Фуді - зареєструватись",
};

export default function page() {
  return <RegisterClient />;
}
