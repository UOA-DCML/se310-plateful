import { useEffect, useMemo, useRef, useState } from "react";

import { MdFormatSize } from "react-icons/md";

import { useTextSize } from "../context/TextSizeContext";

export default function TextSizeSlider({ className = "" }) {
  const { scale, setScale } = useTextSize();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const currentPercent = useMemo(() => Math.round(scale * 100), [scale]);
  const options = useMemo(() => [85, 95, 105, 115, 125, 135], []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!popoverRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-full border border-lime-100 bg-white p-2 text-xs font-medium text-gray-700 shadow-sm transition hover:border-lime-200 hover:text-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Adjust text size (current ${currentPercent}%)`}
      >
        <span className="sr-only">Adjust text size</span>
        <MdFormatSize className="h-4 w-4 text-gray-600" aria-hidden="true" />
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[1100] mt-2 w-56 rounded-xl border border-lime-100 bg-white p-4 shadow-xl">
          <div className="flex flex-col gap-3 text-xs text-gray-600">
            <span className="text-[11px] uppercase tracking-wide text-gray-500">
              Choose text size
            </span>
            <div className="grid grid-cols-3 gap-2">
              {options.map((option) => {
                const isActive = currentPercent === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScale(option / 100)}
                    className={`rounded-lg border px-2 py-1 text-center text-[12px] font-medium transition focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-1 ${
                      isActive
                        ? "border-lime-500 bg-lime-50 text-lime-700 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-lime-200 hover:text-lime-700"
                    }`}
                  >
                    {option}%
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setScale(1)}
              className={`rounded-lg border px-2 py-1 text-center text-[12px] font-medium transition focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-1 ${
                currentPercent === 100
                  ? "border-lime-500 bg-lime-50 text-lime-700 shadow-sm"
                  : "border-gray-200 text-gray-500 hover:border-lime-200 hover:text-lime-700"
              }`}
            >
              Default 100%
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
