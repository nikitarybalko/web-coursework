import React from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";

const OFFERS = [
  {
    id: 1,
    title: "Смачна їжа",
    tags: "Чай та кава • Соки та смузі • Сніданки та обіди • Кр...",
    badge: "-30% від 500 грн",
    imageUrl: "/img/image-1.png",
  },
  {
    id: 2,
    title: "Смачна їжа",
    tags: "Чай та кава • Соки та смузі • Сніданки та обіди • Кр...",
    badge: "-30% від 500 грн",
    imageUrl: "/img/image-1.png",
  },
  {
    id: 3,
    title: "Смачна їжа",
    tags: "Чай та кава • Соки та смузі • Сніданки та обіди • Кр...",
    badge: "-30% від 500 грн",
    imageUrl: "/img/image-1.png",
  },
];

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex flex-col mt-10 px-10">
        <h1 className="text-2xl font-medium">Спеціальні пропозиції</h1>
        <span className="text-[#625B71] text-sm">Від місцевих закладів</span>
      </main>
    </div>
  );
}
