import { createFileRoute, Link } from "@tanstack/react-router";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { buildWhatsAppOrderUrl, useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — ZERO GRAVITY" },
      { name: "description", content: "Review your selected ZG accessories and place your order via WhatsApp." },
    ],
  }),
  component: CartPage,
});

function priceNumber(p: string) {
  const n = Number(p.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const subtotal = items.reduce((s, i) => s + priceNumber(i.price) * i.qty, 0);
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col">
      <Nav />

      <section className="pt-32 pb-10 px-6 border-b border-yellow/10 bg-grid">
        <div className="max-w-6xl mx-auto">
          <div className="text-yellow text-xs tracking-[0.5em] uppercase mb-3">— Your Selection —</div>
          <h1 className="font-display font-black text-4xl md:text-6xl">
            Your <span className="text-yellow text-glow">Cart</span>
          </h1>
        </div>
      </section>

      <section className="py-16 px-6 flex-1">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 ? (
            <div className="card-dark p-16 text-center">
              <p className="text-foreground/60 mb-6">Your cart is empty. Time to gear up.</p>
              <Link to="/accessories" className="btn-yellow">Browse Accessories</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              <div className="space-y-4">
                {items.map((i) => (
                  <div key={i.id} className="card-dark p-4 flex items-center gap-4">
                    <img src={i.img} alt={i.name} width={96} height={96} className="w-24 h-24 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-yellow/80">{i.cat}</div>
                      <h3 className="font-display font-bold truncate">{i.name}</h3>
                      <p className="text-yellow text-sm mt-1">{i.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(i.id, i.qty - 1)} className="w-8 h-8 rounded-full border border-yellow/30 text-yellow hover:bg-yellow hover:text-primary-foreground transition">−</button>
                      <span className="w-6 text-center font-display">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} className="w-8 h-8 rounded-full border border-yellow/30 text-yellow hover:bg-yellow hover:text-primary-foreground transition">+</button>
                    </div>
                    <button onClick={() => remove(i.id)} className="text-xs text-foreground/50 hover:text-yellow ml-2">Remove</button>
                  </div>
                ))}
                <button onClick={clear} className="text-xs tracking-[0.3em] uppercase text-foreground/50 hover:text-yellow">
                  Clear cart
                </button>
              </div>

              <aside className="card-dark p-6 lg:sticky lg:top-24">
                <h2 className="font-display font-bold text-xl mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm text-foreground/70 mb-2">
                  <span>Subtotal</span>
                  <span className="text-foreground">{fmt.format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-foreground/50 mb-6">
                  <span>Shipping & taxes</span>
                  <span>Confirmed on WhatsApp</span>
                </div>
                <a
                  href={buildWhatsAppOrderUrl(items)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-yellow w-full justify-center"
                >
                  Order Now via WhatsApp
                </a>
                <Link to="/accessories" className="btn-ghost-yellow w-full justify-center mt-3">
                  Continue Shopping
                </Link>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 text-center mt-6">
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
