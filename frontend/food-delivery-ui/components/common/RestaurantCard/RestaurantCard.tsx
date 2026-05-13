import Link from "next/link";
import { Restaurant } from "@/types/Restaurant";
import Image from "next/image";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  return (
    <Link href={`/food/${restaurant.id}`} className="group flex flex-col gap-3">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
        <Image
          fill
          src={restaurant.imagePath || "/placeholder-restaurant.jpg"}
          alt={restaurant.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-green-primary transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {restaurant.description}
        </p>
      </div>
    </Link>
  );
}
