"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import {
  UtensilsCrossed,
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings,
} from "lucide-react";

const ICONS = {
  menu: UtensilsCrossed,
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  reviews: MessageSquare,
  settings: Settings,
};

interface SidebarLinkProps {
  href: string;
  iconName: keyof typeof ICONS;
  label: string;
}

export const SidebarLink = ({ href, iconName, label }: SidebarLinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const Icon = ICONS[iconName];

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${
          isActive
            ? "bg-white text-brand-green-secondary shadow-sm"
            : "text-white hover:bg-white/10"
        }
      `}
    >
      <Icon
        size={22}
        className={`${isActive ? "text-brand-green-secondary" : "text-white"} group-hover:scale-110 transition-transform`}
      />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};
