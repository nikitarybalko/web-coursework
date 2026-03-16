"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function SearchToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="flex items-center h-10">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-gray-800 hover:text-black font-medium text-sm cursor-pointer transition-colors"
        >
          <Search size={20} />
          <span className="hidden sm:inline">Пошук</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 animate-in fade-in zoom-in-95 duration-200">
          <Search size={18} className="text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Шукати страви..."
            className="bg-transparent border-none outline-none text-sm w-32 sm:w-48 text-gray-800 placeholder-gray-500"
            onBlur={() => setIsOpen(false)}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-800 cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
