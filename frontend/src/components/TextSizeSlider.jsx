import { useEffect, useMemo, useRef, useState } from "react";
import { useTextSize } from "../context/TextSizeContext";
import { useTheme } from "../context/ThemeContext";
import textSliderIcon from "../assets/textslidericon.png";

export default function TextSizeSlider({ className = "" }) {
  const { scale, setScale, min, max } = useTextSize();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingScale, setPendingScale] = useState(null);
  const popoverRef = useRef(null);
  const sliderRef = useRef(null);
  const delayTimerRef = useRef(null);

  // Define scale steps: 80%, 90%, 100%, 110%, 120%, 130%
  const scaleSteps = useMemo(() => [0.80, 0.90, 1.00, 1.10, 1.20, 1.30], []);

  const currentPercent = useMemo(() => Math.round((pendingScale || scale) * 100), [scale, pendingScale]);

  // Convert scale to percentage position (0-100)
  const scaleToPercent = (s) => ((s - min) / (max - min)) * 100;

  // Find nearest scale step based on slider position
  const findNearestStep = (percent) => {
    const targetScale = (percent / 100) * (max - min) + min;
    return scaleSteps.reduce((prev, curr) =>
      Math.abs(curr - targetScale) < Math.abs(prev - targetScale) ? curr : prev
    );
  };

  const handleSliderChange = (clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    // Find nearest step and store as pending
    const nearestStep = findNearestStep(percent);
    setPendingScale(nearestStep);

    // Clear existing timer
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
    }
  };

  const applyPendingScale = () => {
    if (pendingScale !== null) {
      setScale(pendingScale);
      setPendingScale(null);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSliderChange(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      handleSliderChange(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      // Apply scale after 0.7 second delay
      delayTimerRef.current = setTimeout(() => {
        applyPendingScale();
      }, 700);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, min, max, scaleSteps, pendingScale]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, []);

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
        className={`flex items-center justify-center rounded-full border p-2 text-xs font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-1 ${isDark
            ? 'border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-500 hover:text-lime-400'
            : 'border-lime-100 bg-white text-gray-700 hover:border-lime-200 hover:text-lime-700'
          }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Adjust text size (current ${currentPercent}%)`}
      >
        <span className="sr-only">Adjust text size</span>
        <img
          src={textSliderIcon}
          alt=""
          className="h-4 w-4"
          aria-hidden="true"
        />
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
        <div className={`absolute right-0 z-[1100] mt-2 w-64 rounded-xl border p-4 shadow-xl ${isDark
            ? 'border-gray-600 bg-gray-800'
            : 'border-lime-100 bg-white'
          }`}>
          <div className={`flex flex-col gap-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Text size
              </span>
              <span className={`text-sm font-semibold ${isDark ? 'text-lime-400' : 'text-lime-700'}`}>
                {currentPercent}%
              </span>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-2">
              <div
                ref={sliderRef}
                className={`relative h-2 rounded-full cursor-pointer ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                onMouseDown={handleMouseDown}
              >
                {/* Scale notches */}
                {scaleSteps.map((step) => {
                  const stepPercent = scaleToPercent(step);
                  return (
                    <div
                      key={step}
                      className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      style={{ left: `${stepPercent}%` }}
                    />
                  );
                })}

                {/* Progress bar */}
                <div
                  className={`absolute h-full rounded-full transition-all duration-150 ${isDark ? 'bg-lime-500' : 'bg-lime-600'
                    }`}
                  style={{
                    width: `${scaleToPercent(pendingScale || scale)}%`
                  }}
                />

                {/* Draggable thumb */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all duration-150 ${isDark
                      ? 'bg-lime-400 border-2 border-lime-300'
                      : 'bg-white border-2 border-lime-600'
                    } ${isDragging ? 'scale-110' : 'hover:scale-110'}`}
                  style={{
                    left: `calc(${scaleToPercent(pendingScale || scale)}% - 0.625rem)`
                  }}
                />
              </div>

              {/* Scale labels */}
              <div className={`flex justify-between text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {scaleSteps.map((step) => (
                  <span key={step} className="flex-1 text-center">
                    {Math.round(step * 100)}%
                  </span>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={() => {
                setScale(1);
                setPendingScale(null);
                if (delayTimerRef.current) {
                  clearTimeout(delayTimerRef.current);
                }
              }}
              className={`mt-1 rounded-lg border px-3 py-2 text-center text-[12px] font-medium transition focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-1 ${currentPercent === 100
                  ? isDark
                    ? "border-lime-500 bg-lime-900/30 text-lime-400 shadow-sm"
                    : "border-lime-500 bg-lime-50 text-lime-700 shadow-sm"
                  : isDark
                    ? "border-gray-600 text-gray-400 hover:border-lime-500 hover:text-lime-400"
                    : "border-gray-200 text-gray-500 hover:border-lime-200 hover:text-lime-700"
                }`}
            >
              Reset to Default (100%)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
