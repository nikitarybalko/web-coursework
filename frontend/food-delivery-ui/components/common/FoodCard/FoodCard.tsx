import Image from "next/image";

interface FoodCardProps {
  imagePath: string;
  title: string;
  tags: string;
  price: number;
}

export default function FoodCard({
  imagePath,
  title,
  tags,
  price,
}: FoodCardProps) {
  return (
    // shrink-0 дуже важливий для слайдерів, щоб картки не стискалися
    <div className="flex flex-col gap-3 w-full h-full cursor-pointer group">
      {/* Контейнер для зображення та бейджа */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        {/* Зображення з легким ефектом збільшення при наведенні */}
        <Image
          fill
          src={imagePath || "/placeholder-image.jpg"}
          alt={title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Бейдж зі знижкою */}
        {/* {badge && (
          <div className="absolute top-3 right-3 bg-[#8B5CF6] text-white text-xs font-medium px-2 py-1 rounded-md">
            {badge}
          </div>
        )} */}
      </div>

      {/* Текстова частина */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        {/* truncate додає три крапки (...), якщо текст не влазить в один рядок */}
        <p className="text-sm text-[#625B71] truncate">{tags}</p>
      </div>
    </div>
  );
}
