import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-brand-white-primary shadow-card rounded-xl">
      {children}
    </div>
  );
}
