import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  const interactiveClasses = onClick
    ? "cursor-pointer hover:shadow-md transition-shadow"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
}
