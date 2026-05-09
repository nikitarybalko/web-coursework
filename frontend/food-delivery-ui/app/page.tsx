import React from "react";
import Header from "@/components/common//Header/Header";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CategorySlider from "@/components/common/CategorySlider/CategorySlider";
import { ArrowRight, Pizza } from "lucide-react";
import FoodCard from "@/components/common/FoodCard/FoodCard";
import Footer from "@/components/common/Footer/Footer";
import { fetchCategories } from "@/lib/utils";

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

export const metadata: Metadata = {
  title: "Фуді - твій путівник у світ їжі",
};

export default async function Home() {
  const categories = await fetchCategories();
  return (
    <>
      <Header />
      <main className="flex flex-col grow bg-background py-std px-std">
        <div className="flex flex-col max-w-page-max-w w-full self-center">
          <h1 className="text-2xl font-medium">Спеціальні пропозиції</h1>
          <span className="text-[#625B71] text-sm">Від місцевих закладів</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {OFFERS.map((o) => (
              <FoodCard
                key={o.id}
                imagePath={o.imageUrl}
                title={o.title}
                tags={o.tags}
                badge={o.badge}
              />
            ))}
          </div>
          <hr className="mt-std" />
          <CategorySlider categories={categories} />
          <Link className="w-fit" href="/food">
            <Button className="group flex items-center gap-2">
              Більше їжі{" "}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
