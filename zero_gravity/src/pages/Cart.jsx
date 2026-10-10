import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { buildWhatsAppOrderUrl, useCart } from "@/lib/cart";
import { useSEO } from "@/lib/useSEO";

function priceNumber(p) {
  const n = Number(p.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function Cart() {
  useSEO({
    title: "Your Cart | Review Order & WhatsApp Checkout — ZERO GRAVITY",
    description: "Review your selected motorcycle accessories and riding gear. Instant checkout and confirmation with the Zero Gravity crew on WhatsApp.",
    keywords: "Zero Gravity cart, order motorcycle gear WhatsApp, buy bike accessories Mangaluru"
  });

  const { items, setQty, remove, clear } = useCart();
  const subtotal = items.reduce((s, i) => s + priceNumber(i.price) * i.qty, 0);
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col">
      <Nav />

      <section className="pt-24 sm:pt-32 pb-8 sm:pb-10 px-4 sm:px-6 border-b border-yellow/10 bg-grid">
        <div className="max-w-6xl mx-auto">
          <div className="text-yellow text-xs tracking-[0.4em] uppercase mb-2 sm:mb-3 font-semibold">— Your Selection —</div>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-6xl text-white">
            Your <span className="text-yellow">Cart</span>
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-16 px-4 sm:px-6 flex-1">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 ? (
            <div className="card-dark p-8 sm:p-16 text-center max-w-lg mx-auto">
              <p className="text-foreground/60 mb-6 font-body text-sm sm:text-base">Your cart is empty. Time to gear up.</p>
              <Link to="/accessories" className="btn-yellow text-xs sm:text-sm">Browse Accessories</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
              <div className="space-y-3.5 sm:space-y-4">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="card-dark p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4"
                  >
                    {/* Top Row on Mobile: Image + Details */}
                    <div className="flex items-center gap-3 sm:contents">
                      {i.img ? (
                        <img
                          src={i.img}
                          alt={i.name}
                          width={96}
                          height={96}
                          className="w-18 h-18 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0 bg-zinc-900 border border-zinc-800"
                        />
                      ) : (
                        <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center text-zinc-600 text-xs font-bold uppercase">
                          Gear
                        </div>
                      )}

                      {/* Mobile title + price */}
                      <div className="flex-1 min-w-0 sm:hidden">
                        <div className="text-[10px] tracking-wider uppercase text-yellow/80 font-semibold">{i.cat}</div>
                        <h3 className="font-display font-bold text-sm text-white truncate">{i.name}</h3>
                        <p className="text-yellow text-sm mt-0.5 font-bold">{i.price}</p>
                      </div>
                    </div>

                    {/* Desktop title + price */}
                    <div className="hidden sm:block flex-1 min-w-0">
                      <div className="text-[10px] tracking-wider uppercase text-yellow/80 font-semibold">{i.cat}</div>
                      <h3 className="font-display font-bold text-base text-white truncate">{i.name}</h3>
                      <p className="text-yellow text-sm mt-1 font-bold">{i.price}</p>
                    </div>

                    {/* Actions: Stepper and Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t border-zinc-800/80 sm:border-t-0">
                      <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="w-8 h-8 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center font-bold text-sm select-none"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-display font-bold text-sm text-white">{i.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="w-8 h-8 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center font-bold text-sm select-none"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(i.id)}
                        className="text-xs text-zinc-400 hover:text-red-400 py-1.5 px-3 rounded-lg border border-zinc-800 hover:border-red-900/40 transition cursor-pointer font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <button
                    onClick={clear}
                    className="text-xs tracking-wider uppercase text-zinc-500 hover:text-yellow transition cursor-pointer font-semibold py-1"
                  >
                    Clear cart
                  </button>
                </div>
              </div>

              <aside className="card-dark p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="font-display font-bold text-lg sm:text-xl mb-4 text-white">Order Summary</h2>
                <div className="flex justify-between text-sm text-zinc-300 mb-2 font-body">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{fmt.format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 mb-6 font-body">
                  <span>Shipping & taxes</span>
                  <span>Confirmed on WhatsApp</span>
                </div>
                <a
                  href={buildWhatsAppOrderUrl(items)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-yellow w-full justify-center text-center cursor-pointer text-xs sm:text-sm py-3"
                >
                  Order Now via WhatsApp
                </a>
                <Link
                  to="/accessories"
                  className="btn-ghost-yellow w-full justify-center mt-3 text-center text-xs sm:text-sm py-3"
                >
                  Continue Shopping
                </Link>
                <p className="text-[10px] tracking-widest uppercase text-zinc-500 text-center mt-5 font-semibold">
                  Secure checkout · Personal assistance
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
