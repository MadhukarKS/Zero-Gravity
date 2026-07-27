import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ACCESSORIES, CATEGORIES } from "@/lib/accessories";
import { buildWhatsAppSingleUrl, useCart } from "@/lib/cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Premium Riding Accessories — ZERO GRAVITY" },
      {
        name: "description",
        content:
          "Shop ZG-curated helmets, jackets, gloves, boots, exhausts and more. Add to cart or order instantly via WhatsApp.",
      },
      { property: "og:title", content: "ZG Accessories — Premium Riding Gear" },
      {
        property: "og:description",
        content: "Helmets, jackets, gloves, boots, exhausts, eyewear and more — curated by Zero Gravity.",
      },
    ],
  }),
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const { add } = useCart();

  const items = useMemo(() => {
    return ACCESSORIES.filter(
      (a) =>
        (cat === "All" || a.cat === cat) &&
        (q.trim() === "" || a.name.toLowerCase().includes(q.toLowerCase())),
    );
  }, [cat, q]);

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <Nav />

      {/* Header */}
      <section className="relative pt-36 pb-20 px-6 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-yellow text-xs tracking-[0.5em] uppercase mb-4 font-semibold">— Gear Up —</div>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.02]">
            The <span className="text-yellow text-glow">Accessories</span> Vault
          </h1>
          <p className="mt-5 text-foreground/80 max-w-2xl text-sm md:text-base leading-relaxed font-body">
            Every piece curated, tested and ZG-approved. Add to cart or hit{" "}
            <span className="text-yellow font-semibold">Order Now</span> to talk to us directly on WhatsApp.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 max-w-3xl relative z-10">
            {/* Search bar */}
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search helmets, gloves, exhausts…"
                className="w-full bg-card border border-border focus:border-yellow outline-none pl-12 pr-4 py-3.5 rounded-lg text-base text-foreground placeholder:text-muted-foreground/50 transition-all duration-300 shadow-inner"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </div>

            {/* Category Drawer Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open Category Menu"
                  className="flex items-center justify-center gap-3 px-6 py-3.5 border border-border hover:border-yellow text-sm font-bold tracking-wider uppercase rounded-lg bg-card hover:bg-yellow/5 transition-all duration-300 text-foreground cursor-pointer shrink-0 group shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="w-5 h-5 text-yellow transition-transform duration-300 group-hover:scale-105"
                  >
                    <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="14" y2="12" strokeLinecap="round" />
                    <line x1="4" y1="18" x2="18" y2="18" strokeLinecap="round" />
                  </svg>
                  <span>Category Menu</span>
                  {cat !== "All" && (
                    <span className="bg-yellow text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                      {cat[0]}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="bg-card border-l border-border p-6 text-foreground sm:max-w-md flex flex-col justify-between z-[100]">
                <div>
                  <SheetHeader className="pb-6 border-b border-border">
                    <SheetTitle className="font-display font-black text-2xl uppercase tracking-wider text-foreground">
                      Categories
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground text-xs">
                      Select a category to filter the accessories vault.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 flex flex-col gap-1.5">
                    {CATEGORIES.map((c) => {
                      const active = cat === c;
                      return (
                        <SheetClose asChild key={c}>
                          <button
                            onClick={() => setCat(c)}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                              active
                                ? "bg-yellow text-primary-foreground font-bold shadow-md"
                                : "hover:bg-white/5 text-foreground/80 hover:text-white"
                            }`}
                          >
                            <span>{c}</span>
                            {active && <span className="text-xs">✓</span>}
                          </button>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>
                {cat !== "All" && (
                  <div className="pt-6 border-t border-border mt-auto">
                    <SheetClose asChild>
                      <button
                        onClick={() => setCat("All")}
                        className="w-full btn-ghost-yellow justify-center text-xs tracking-widest"
                      >
                        Clear Filters
                      </button>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Quick Filter Horizontal Scroll Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 ${
                    active
                      ? "bg-yellow text-primary-foreground shadow-md"
                      : "bg-card border border-border text-foreground/70 hover:border-yellow/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/80 font-semibold">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <Link to="/cart" className="text-xs tracking-[0.3em] uppercase text-yellow hover:underline">
              View Cart →
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 text-foreground/50">
              No products match your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((a) => (
                <article key={a.id} className="card-dark overflow-hidden group flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <img
                      src={a.img}
                      alt={a.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 bg-yellow text-primary-foreground text-[10px] font-display font-black tracking-widest px-2 py-1 rounded">
                      {a.cat}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="font-display font-bold text-base leading-tight text-foreground">{a.name}</h3>
                      {a.desc && (
                        <p className="text-foreground/85 text-xs mt-1.5 leading-relaxed line-clamp-2 font-body">
                          {a.desc}
                        </p>
                      )}
                    </div>
                    <p className="text-yellow font-display text-lg font-bold mt-auto">{a.price}</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() =>
                          add({ id: a.id, name: a.name, cat: a.cat, price: a.price, img: a.img })
                        }
                        className="text-[11px] tracking-[0.25em] uppercase font-semibold border border-yellow/60 text-yellow rounded py-2.5 hover:bg-yellow hover:text-primary-foreground transition cursor-pointer"
                      >
                        + Add to Cart
                      </button>
                      <a
                        href={buildWhatsAppSingleUrl(a)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] tracking-[0.25em] uppercase bg-yellow text-primary-foreground rounded py-2.5 font-bold hover:brightness-110 transition text-center flex items-center justify-center cursor-pointer"
                      >
                        Order Now
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
