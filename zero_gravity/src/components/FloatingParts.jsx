import { useMemo } from "react";

export default function FloatingParts() {
  const items = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        top: `${(i * 18 + 8) % 85}%`,
        left: `${(i * 29 + 11) % 90}%`,
        size: 16 + ((i * 6) % 24),
        delay: i * 0.8,
        rot: (i * 45) % 360,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-25">
      {items.map((it, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: it.top,
            left: it.left,
            width: it.size,
            height: it.size,
            "--tx": "0px",
            "--ty": "0px",
            "--r": `${it.rot}deg`,
            willChange: "transform",
            animation: `float-part ${7 + (i % 3)}s ease-in-out ${it.delay}s infinite`,
          }}
        >
          <div
            className="w-full h-full rounded-full border border-yellow/40 bg-yellow/5"
            style={{
              boxShadow: "0 0 10px rgba(229,169,59,0.3)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
