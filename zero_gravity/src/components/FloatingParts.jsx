import { useMemo } from "react";

export default function FloatingParts() {
  const items = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        top: `${(i * 13 + 5) % 90}%`,
        left: `${(i * 23 + 7) % 95}%`,
        size: 20 + ((i * 7) % 30),
        delay: i * 0.7,
        rot: (i * 37) % 360,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
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
            animation: `float-part ${6 + (i % 4)}s ease-in-out ${it.delay}s infinite`,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, var(--yellow) 50%, transparent)",
              opacity: 0.4,
              filter: "blur(0.5px)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
