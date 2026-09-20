import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  required = false,
  className = "",
  disabled = false,
  size = "md", // "sm" | "md"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  const displayLabel = selectedOption ? selectedOption.label : placeholder;
  const isSelected = Boolean(selectedOption && selectedOption.value !== "" && selectedOption.value !== "all");
  const isSm = size === "sm";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full ${
          isSm ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
        } bg-[#0a0b10] border rounded-xl flex items-center justify-between transition-all outline-none cursor-pointer select-none text-left ${
          disabled
            ? "opacity-50 cursor-not-allowed border-zinc-800 text-zinc-500"
            : isOpen
            ? "border-[#e5a93b] ring-1 ring-[#e5a93b] text-white"
            : isSelected
            ? "border-zinc-800 text-white hover:border-zinc-700"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
        }`}
      >
        <span className="truncate pr-2">{displayLabel}</span>
        <ChevronDown
          className={`${isSm ? "w-3.5 h-3.5" : "w-4 h-4"} text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#e5a93b]" : ""
          }`}
        />
      </button>

      {/* Styled Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 min-w-full bg-[#12141c] border border-zinc-800 rounded-xl shadow-2xl py-1.5 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-xs text-zinc-500 text-center">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const active = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left ${
                    isSm ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
                  } flex items-center justify-between transition-colors cursor-pointer ${
                    active
                      ? "bg-[#e5a93b]/15 text-[#e5a93b] font-medium"
                      : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && (
                    <Check
                      className={`${
                        isSm ? "w-3.5 h-3.5" : "w-4 h-4"
                      } text-[#e5a93b] shrink-0 ml-2`}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
