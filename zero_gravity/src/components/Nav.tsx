import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import zeroGravityLogo from "@/assets/zero_gravity.jpeg";

export default function Nav() {
  const { count } = useCart();
  return (
    <nav className="fixed top-0 left-0 right-0 w-screen z-50 backdrop-blur-xl bg-background/60 border-b border-yellow/10">
      <div className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6 h-16 px-4 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3 min-w-0 shrink">
          <img
            src={zeroGravityLogo}
            alt="Zero Gravity"
            width={44}
            height={44}
            className="h-10 w-10 rounded-full bg-black/40 object-cover shrink-0 ring-1 ring-yellow/20"
          />
          <span className="hidden sm:inline font-display font-black tracking-[0.25em] text-yellow text-sm md:text-base truncate">
            ZERO·GRAVITY
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center gap-8 text-[11px] tracking-[0.3em] uppercase text-foreground/70">
          <Link to="/" hash="about" className="hover:text-yellow transition">About</Link>
          <Link to="/" hash="services" className="hover:text-yellow transition">Services</Link>
          <Link to="/" hash="gallery" className="hover:text-yellow transition">Gallery</Link>
          <Link to="/accessories" className="hover:text-yellow transition" activeProps={{ className: "text-yellow" }}>
            Accessories
          </Link>
          <Link to="/" hash="contact" className="hover:text-yellow transition">Contact</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative w-10 h-10 rounded-full border border-yellow/30 text-yellow hover:bg-yellow hover:text-primary-foreground transition flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="10" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow text-primary-foreground text-[10px] font-black flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link to="/book-service" className="btn-yellow !py-2 !px-3 sm:!px-4 !text-[10px] sm:!text-xs shrink-0">
            Book Service
          </Link>
        </div>
      </div>
    </nav>
  );
}
