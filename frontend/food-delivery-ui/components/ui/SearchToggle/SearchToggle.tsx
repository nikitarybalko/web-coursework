"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { fetchAllDishes } from "@/lib/utils";

export default function SearchToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 500);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedText.trim()) {
      setResultCount(null);
      setIsSearching(false);
      return;
    }

    const fetchCount = async () => {
      setIsSearching(true);
      try {
        const data = await fetchAllDishes({
          page: 0,
          size: 1,
          search: encodeURIComponent(debouncedText),
        });
        console.log(data.page);
        setResultCount(data.page?.totalElements || 0);
      } catch (error) {
        console.error("Помилка пошуку:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchCount();
  }, [debouncedText]);

  const handleSearchGo = () => {
    if (resultCount && resultCount > 0) {
      setIsOpen(false);
      setText("");
      router.push(`/search?q=${encodeURIComponent(debouncedText)}`);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setText("");
    setResultCount(null);
  };

  return (
    <div className="relative flex items-center h-10">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-gray-800 hover:text-black font-medium text-sm transition-colors"
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
            value={text}
            placeholder="Шукати страви..."
            onChange={(e) => setText(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-32 sm:w-48md:w-64 text-gray-800 placeholder-gray-500"
            onBlur={() => {
              setTimeout(() => setIsOpen(false), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchGo();
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 shrink-0"
          >
            <X size={16} />
          </button>

          {text.trim() && isOpen && (
            <div className="absolute top-full right-0 mt-3 w-full sm:w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
              {isSearching ? (
                <div className="flex items-center justify-center p-4 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm">Шукаємо...</span>
                </div>
              ) : resultCount !== null ? (
                resultCount > 0 ? (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleSearchGo}
                    className="w-full flex items-center justify-between p-3 bg-brand-green-secondary/10 hover:bg-brand-green-secondary/20 text-brand-green-primary rounded-xl transition-colors text-left"
                  >
                    <span className="font-semibold text-sm">
                      Знайдено {resultCount} страв
                    </span>
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    На жаль, нічого не знайдено :(
                  </div>
                )
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
