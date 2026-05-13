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
import OfferFoodCard from "@/components/common/OfferFoodCard/OfferFoodCard";

const OFFERS = [
  {
    id: 1,
    title: "Смачна їжа",
    tags: "Чай та кава • Соки та смузі • Сніданки та обіди",
    badge: "-30% від 500 грн",
    imageUrl: "/img/image-1.png",
  },
  {
    id: 2,
    title: "Бургеропад",
    tags: "Смачнююючі знижки на бургери і не тільки",
    badge: "-30% на всі бургери",
    imageUrl: "/img/image-2.jpg",
  },
  {
    id: 3,
    title: "Коктейлі",
    tags: "Літо вже близько! Замовляйте коктейлі дешевше від 2 штук",
    badge: "-40% від 2 позицій",
    imageUrl: "/img/image-3.jpg",
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
              <OfferFoodCard
                key={o.id}
                title={o.title}
                tags={o.tags}
                badge={o.badge}
                imageUrl={o.imageUrl}
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
