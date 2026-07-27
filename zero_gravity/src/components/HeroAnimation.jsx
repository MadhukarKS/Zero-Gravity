import { useEffect, useState } from "react";
import bikeHero from "@/assets/bike-hero.jpg";
import zeroGravityLogo from "@/assets/zero_gravity.jpeg";
import { Link } from "@tanstack/react-router";

const PARTS = [
  { x: -360, y: -160, r: -30, w: 90, h: 90, shape: "wheel" },
  { x: 340, y: -180, r: 25, w: 90, h: 90, shape: "wheel" },
  { x: -200, y: 140, r: 15, w: 80, h: 28, shape: "bar" },
  { x: 240, y: 160, r: -20, w: 80, h: 28, shape: "bar" },
  { x: -420, y: 60, r: 45, w: 44, h: 44, shape: "bolt" },
  { x: 400, y: -40, r: -45, w: 44, h: 44, shape: "bolt" },
  { x: -120, y: -220, r: 10, w: 110, h: 32, shape: "exhaust" },
  { x: 140, y: 200, r: -10, w: 110, h: 32, shape: "exhaust" },
  { x: 0, y: -260, r: 0, w: 56, h: 56, shape: "wheel" },
  { x: 0, y: 240, r: 0, w: 48, h: 48, shape: "bolt" },
];

function Part({ shape, w, h }) {
  if (shape === "wheel")
    return (
      <div
        style={{
          width: w,
          height: h,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #2a2a2a, #0a0a0a 70%)",
          border: "2px solid #e5a93b",
          boxShadow: "0 0 16px rgba(229,169,59,0.35)",
        }}
      />
    );
  if (shape === "bar")
    return (
      <div
        style={{
          width: w,
          height: h,
          background: "linear-gradient(90deg, #1a1a1a, #555, #1a1a1a)",
          borderRadius: 4,
          borderTop: "1px solid #e5a93b",
        }}
      />
    );
  if (shape === "exhaust")
    return (
      <div
        style={{
          width: w,
          height: h,
          background: "linear-gradient(180deg, #666, #1a1a1a)",
          borderRadius: 999,
          boxShadow: "0 0 14px rgba(229,169,59,0.3)",
        }}
      />
    );
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "conic-gradient(from 0deg, #e5a93b, #92741a, #e5a93b)",
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      }}
    />
  );
}

export default function HeroAnimation() {
  const [phase, setPhase] = useState("ride");

  useEffect(() => {
    const hasLoaded = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("zg-loaded") : null;
    if (hasLoaded) {
      setPhase("logo");
      return;
    }
    const t1 = setTimeout(() => setPhase("explode"), 350);
    const t2 = setTimeout(() => setPhase("float"), 700);
    const t3 = setTimeout(() => setPhase("implode"), 1400);
    const t4 = setTimeout(() => {
      setPhase("logo");
      if (typeof sessionStorage !== "undefined") sessionStorage.setItem("zg-loaded", "true");
    }, 1800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const skipIntro = () => {
    setPhase("logo");
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem("zg-loaded", "true");
  };

  const showBike = phase === "ride" || phase === "explode";
  const showParts = phase === "explode" || phase === "float" || phase === "implode";
  const showLogo = phase === "logo";

  return (
    <div className="relative w-full h-full min-h-[100svh] flex items-center justify-center overflow-hidden">
      {!showLogo && (
        <button
          onClick={skipIntro}
          className="absolute bottom-10 right-10 z-50 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase bg-black/60 hover:bg-black/90 text-foreground/80 hover:text-yellow border border-white/10 hover:border-yellow/50 rounded-full px-5 py-2.5 transition duration-200 pointer-events-auto cursor-pointer shadow-lg backdrop-blur-md"
        >
          Skip Intro
        </button>
      )}

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_85%)]" />
      {/* Yellow ambient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "var(--gradient-radial-yellow)",
          opacity: showLogo ? 0.95 : 0.4,
        }}
      />

      {/* Race bike with hardware acceleration */}
      {showBike && (
        <div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{
            animation:
              phase === "ride"
                ? "ride-in 0.6s cubic-bezier(.16,.84,.3,1) forwards"
                : "none",
            willChange: "transform, opacity",
          }}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-yellow/15 blur-3xl rounded-full scale-110 pointer-events-none" />
            <img
              src={bikeHero}
              alt="ZERO GRAVITY superbike"
              width={1200}
              height={675}
              fetchPriority="high"
              decoding="async"
              className="w-[min(94vw,1200px)] h-auto object-contain relative z-10"
              style={{
                opacity: phase === "explode" ? 0 : 1,
                transform: phase === "explode" ? "scale(1.05)" : "scale(1)",
                transition: "opacity 0.3s, transform 0.4s",
              }}
            />
          </div>
        </div>
      )}

      {/* Parts */}
      {showParts && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PARTS.map((p, i) => {
            const isFloat = phase === "float";
            const isImplode = phase === "implode";
            const anim = isImplode
              ? "implode 0.4s cubic-bezier(.7,0,.84,0) forwards"
              : isFloat
              ? "float-part 4s ease-in-out infinite"
              : "explode 0.5s cubic-bezier(.16,.84,.3,1) forwards";
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  "--ex": `${p.x}px`,
                  "--ey": `${p.y}px`,
                  "--er": `${p.r * 3}deg`,
                  "--tx": `${p.x}px`,
                  "--ty": `${p.y}px`,
                  "--r": `${p.r}deg`,
                  animation: anim,
                  animationDelay: isFloat ? `${i * 0.04}s` : "0s",
                  willChange: "transform",
                  transform: isFloat
                    ? `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.r}deg)`
                    : undefined,
                }}
              >
                <Part shape={p.shape} w={p.w} h={p.h} />
              </div>
            );
          })}
        </div>
      )}

      {/* Final ZG logo reveal */}
      <div
        className="relative z-10 text-center px-6 flex flex-col items-center"
        style={{
          opacity: showLogo ? 1 : 0,
          animation: showLogo
            ? "logo-reveal 0.6s cubic-bezier(.16,.84,.3,1) forwards"
            : "none",
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-2xl bg-yellow/30 transform scale-125" />
          <div
            className="relative rounded-full overflow-hidden bg-black/50 border border-yellow/30 shadow-2xl"
            style={{
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <img
              src={zeroGravityLogo}
              alt="ZERO GRAVITY — The Bikers Destination"
              width={400}
              height={400}
              decoding="async"
              className="block w-[min(64vw,360px)] h-[min(64vw,360px)] object-cover"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-12 sm:w-20 bg-yellow/40" />
          <p className="text-foreground/80 uppercase tracking-[0.4em] text-[10px] sm:text-xs font-semibold font-display">
            The Bikers Destination
          </p>
          <div className="h-px w-12 sm:w-20 bg-yellow/40" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/" hash="gallery" className="btn-yellow">Explore Builds →</Link>
          <Link to="/book-service" className="btn-ghost-yellow">Book Your Service</Link>
        </div>
      </div>

      {showLogo && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-yellow/60 text-[10px] tracking-[0.4em] uppercase animate-pulse z-20">
          Scroll ↓
        </div>
      )}
    </div>
  );
}
