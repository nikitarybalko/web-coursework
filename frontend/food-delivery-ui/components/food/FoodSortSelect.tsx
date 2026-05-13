"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FoodSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "popular";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "popular") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center">
      <span className="mr-2 text-gray-700">Сортування:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] bg-white rounded-xl focus:ring-brand-green-primary">
          <SelectValue placeholder="Оберіть сортування" />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-xl">
          <SelectGroup>
            <SelectItem value="popular">За популярністю</SelectItem>
            <SelectItem value="expensive">Спочатку дорожчі</SelectItem>
            <SelectItem value="cheap">Спочатку дешевші</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
