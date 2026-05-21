"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Promotion } from "@/types/Promotion";

interface PromoCarouselProps {
  promotions: Promotion[];
}

export default function PromoCarousel({ promotions }: PromoCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);

  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden w-full py-4" ref={emblaRef}>
      <div className="flex gap-4 sm:gap-6 touch-pan-y">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="relative flex-shrink-0 flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_30%] aspect-16/10 rounded-2xl overflow-hidden group cursor-pointer"
          >
            {promo.restaurantId ? (
              <Link
                href={`/food/${promo.restaurantId}`}
                className="block w-full h-full"
              >
                <PromoCardContent promo={promo} />
              </Link>
            ) : (
              <PromoCardContent promo={promo} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PromoCardContent({ promo }: { promo: Promotion }) {
  return (
    <>
      {/* Зображення */}
      <Image
        src={promo.imagePath || "/img/placeholder.jpg"}
        alt={promo.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 30vw"
      />

      {/* Градієнт та контент (Тепер плашка живе тут) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-4 sm:p-5 z-10">
        {/* Ярлик "Акція" тепер тут, над заголовком! */}
        <div className="mb-2">
          <span className="inline-block bg-brand-green-primary text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-md">
            Спеціальна пропозиція
          </span>
        </div>

        {/* Заголовок */}
        <h3 className="text-white font-bold text-base sm:text-xl md:text-2xl mb-1 leading-tight line-clamp-1">
          {promo.title}
        </h3>

        {promo.description && (
          <p className="text-gray-200 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3">
            {promo.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/20">
          <span className="text-brand-green-secondary font-medium text-xs sm:text-sm flex items-center gap-1">
            {promo.restaurantName ? (
              <>
                Від {promo.restaurantName} <ArrowRight size={12} />
              </>
            ) : (
              "Діє всюди"
            )}
          </span>

          {promo.validUntil && (
            <span className="text-white/70 text-[10px] sm:text-xs flex items-center gap-1">
              <Clock size={10} />
              До{" "}
              {new Date(promo.validUntil).toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
