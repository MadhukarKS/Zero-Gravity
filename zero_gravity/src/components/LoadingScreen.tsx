import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [done, setDone] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("zg-loaded");
    if (!hasLoaded) {
      setDone(false);
      setVisible(true);
      const t1 = setTimeout(() => {
        setVisible(false);
      }, 450);
      const t2 = setTimeout(() => {
        setDone(true);
        sessionStorage.setItem("zg-loaded", "true");
      }, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center transition-all duration-350 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="text-center">
        <div className="font-display text-yellow text-xs tracking-[0.6em] mb-4">
          IGNITING ENGINE
        </div>
        <div className="relative h-1 w-72 bg-yellow/10 overflow-hidden rounded">
          <div
            className="absolute inset-y-0 left-0 bg-yellow origin-left"
            style={{
              animation: "ignition 0.45s cubic-bezier(.4,0,.2,1) forwards",
              boxShadow: "0 0 14px var(--yellow)",
            }}
          />
        </div>
        <div className="mt-6 font-display text-foreground/60 text-[10px] tracking-[0.4em]">
          ZERO GRAVITY · BIKERS DESTINATION
        </div>
      </div>
    </div>
  );
}

