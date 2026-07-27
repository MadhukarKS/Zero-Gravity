import { useEffect, useState } from "react";
import bikeHero from "@/assets/bike-hero.jpg";
import zeroGravityLogo from "@/assets/zero_gravity.jpeg";
import { Link } from "@tanstack/react-router";

const PARTS = [
  { x: -460, y: -200, r: -45, w: 110, h: 110, shape: "wheel" },
  { x: 440, y: -220, r: 30, w: 110, h: 110, shape: "wheel" },
  { x: -260, y: 180, r: 20, w: 90, h: 32, shape: "bar" },
  { x: 320, y: 220, r: -25, w: 100, h: 36, shape: "bar" },
  { x: -540, y: 80, r: 60, w: 56, h: 56, shape: "bolt" },
  { x: 520, y: -50, r: -60, w: 56, h: 56, shape: "bolt" },
  { x: -160, y: -300, r: 15, w: 140, h: 42, shape: "exhaust" },
  { x: 180, y: 280, r: -15, w: 140, h: 42, shape: "exhaust" },
  { x: -380, y: -70, r: 90, w: 48, h: 48, shape: "bolt" },
  { x: 400, y: 80, r: -90, w: 48, h: 48, shape: "bolt" },
  { x: 0, y: -340, r: 0, w: 72, h: 72, shape: "wheel" },
  { x: 0, y: 320, r: 0, w: 60, h: 60, shape: "bolt" },
  { x: -640, y: -60, r: 45, w: 64, h: 26, shape: "bar" },
  { x: 620, y: 140, r: -45, w: 64, h: 26, shape: "bar" },
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
          border: "3px solid #facc15",
          boxShadow: "0 0 24px rgba(250,204,21,.45), inset 0 0 12px rgba(0,0,0,.85)",
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
          boxShadow: "0 0 16px rgba(250,204,21,.4)",
          borderTop: "1px solid #facc15",
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
          boxShadow: "0 0 22px rgba(250,204,21,.45)",
        }}
      />
    );
  return (
    <div
      style={{
        width: w,
        height: h,
        background:
          "conic-gradient(from 0deg, #facc15, #92741a, #facc15, #92741a, #facc15)",
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
        boxShadow: "0 0 18px rgba(250,204,21,.7)",
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
    const t1 = setTimeout(() => setPhase("explode"), 400);
    const t2 = setTimeout(() => setPhase("float"), 800);
    const t3 = setTimeout(() => setPhase("implode"), 1700);
    const t4 = setTimeout(() => {
      setPhase("logo");
      if (typeof sessionStorage !== "undefined") sessionStorage.setItem("zg-loaded", "true");
    }, 2200);
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
          className="absolute bottom-10 right-10 z-50 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase bg-black/55 hover:bg-black/80 text-foreground/80 hover:text-yellow border border-white/10 hover:border-yellow/50 rounded-full px-5 py-2.5 transition duration-300 pointer-events-auto cursor-pointer shadow-lg backdrop-blur-md"
        >
          Skip Intro
        </button>
      )}

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_85%)]" />
      {/* Yellow ambient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: "var(--gradient-radial-yellow)",
          opacity: showLogo ? 0.95 : 0.4,
        }}
      />

      {/* Race bike */}
      {showBike && (
        <div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{
            animation:
              phase === "ride"
                ? "ride-in 0.8s cubic-bezier(.16,.84,.3,1) forwards"
                : "none",
            willChange: "transform, opacity",
          }}
        >
          <img
            src={bikeHero}
            alt="ZERO GRAVITY superbike"
            width={1600}
            height={900}
            fetchPriority="high"
            className="w-[min(94vw,1300px)] h-auto object-contain"
            style={{
              opacity: phase === "explode" ? 0 : 1,
              transform: phase === "explode" ? "scale(1.1)" : "scale(1)",
              transition: "opacity 0.4s, transform 0.5s",
              filter: phase === "explode"
                ? "blur(6px) brightness(1.4) drop-shadow(0 0 60px color-mix(in oklab, var(--yellow) 30%, transparent))"
                : "drop-shadow(0 0 60px color-mix(in oklab, var(--yellow) 30%, transparent))",
            }}
          />
        </div>
      )}

      {/* Parts */}
      {showParts && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PARTS.map((p, i) => {
            const isFloat = phase === "float";
            const isImplode = phase === "implode";
            const anim = isImplode
              ? "implode 0.5s cubic-bezier(.7,0,.84,0) forwards"
              : isFloat
              ? "float-part 4s ease-in-out infinite"
              : "explode 0.6s cubic-bezier(.16,.84,.3,1) forwards";
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  "--ex": `${p.x}px`,
                  "--ey": `${p.y}px`,
                  "--er": `${p.r * 4}deg`,
                  "--tx": `${p.x}px`,
                  "--ty": `${p.y}px`,
                  "--r": `${p.r}deg`,
                  animation: anim,
                  animationDelay: isFloat ? `${i * 0.05}s` : "0s",
                  willChange: "transform",
                  transform: isFloat
                    ? `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`
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
            ? "logo-reveal 0.8s cubic-bezier(.16,.84,.3,1) forwards"
            : "none",
        }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--yellow) 60%, transparent), transparent 70%)",
              transform: "scale(1.7)",
            }}
          />
          <div
            className="relative rounded-full overflow-hidden bg-black/40 border border-yellow/20"
            style={{
              boxShadow:
                "0 0 50px color-mix(in oklab, var(--yellow) 40%, transparent), 0 0 100px color-mix(in oklab, var(--yellow) 15%, transparent)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          >
            <img
              src={zeroGravityLogo}
              alt="ZERO GRAVITY — The Bikers Destination"
              width={500}
              height={500}
              className="block w-[min(64vw,400px)] h-[min(64vw,400px)] object-cover"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
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
