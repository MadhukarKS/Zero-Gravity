import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart";
import zeroGravityLogo from "@/assets/zero_gravity.jpeg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Nav() {
  const { count } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 w-full max-w-full z-50 backdrop-blur-xl bg-background/80 border-b border-yellow/15">
      <div className="w-full flex items-center justify-between gap-3 sm:gap-6 h-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <img
            src={zeroGravityLogo}
            alt="Zero Gravity"
            width={40}
            height={40}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 object-cover shrink-0 ring-1 ring-yellow/30 group-hover:scale-105 transition-transform"
          />
          <span className="font-display font-black tracking-[0.2em] sm:tracking-[0.25em] text-yellow text-xs sm:text-sm md:text-base truncate">
            ZERO·GRAVITY
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 text-[11px] tracking-[0.25em] lg:tracking-[0.3em] uppercase text-foreground/75 font-medium">
          <Link to="/#about" className="hover:text-yellow transition-colors">About</Link>
          <Link to="/#services" className="hover:text-yellow transition-colors">Services</Link>
          <Link to="/#gallery" className="hover:text-yellow transition-colors">Gallery</Link>
          <Link to="/accessories" className="hover:text-yellow transition-colors">
            Accessories
          </Link>
          <Link to="/#contact" className="hover:text-yellow transition-colors">Contact</Link>
        </div>

        {/* Action Buttons & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cart Icon */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-yellow/30 text-yellow hover:bg-yellow hover:text-primary-foreground transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" />
              <circle cx="10" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-yellow text-primary-foreground text-[10px] font-black flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </Link>

          {/* Book Service Button (Visible on sm and up) */}
          <Link to="/book-service" className="hidden sm:inline-flex btn-yellow !py-2 !px-3.5 !text-xs shrink-0">
            Book Service
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open Navigation Menu"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-card/80 flex items-center justify-center text-foreground hover:border-yellow hover:text-yellow transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5">
                    <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                    <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0f1118] border-l border-border p-6 text-foreground w-[290px] sm:w-80 flex flex-col justify-between z-[100]">
                <div>
                  <SheetHeader className="pb-5 border-b border-border/80 flex flex-row items-center gap-3">
                    <img
                      src={zeroGravityLogo}
                      alt="Zero Gravity"
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-yellow/30"
                    />
                    <div className="text-left">
                      <SheetTitle className="font-display font-black text-base uppercase tracking-wider text-yellow">
                        ZERO GRAVITY
                      </SheetTitle>
                      <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-body mt-0.5">
                        The Bikers Destination
                      </p>
                    </div>
                  </SheetHeader>

                  <div className="py-6 flex flex-col gap-3.5 text-xs uppercase font-semibold tracking-widest">
                    <SheetClose asChild>
                      <Link to="/#about" className="p-2 rounded-lg hover:bg-zinc-800/60 hover:text-yellow transition-colors">
                        About Studio
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/#services" className="p-2 rounded-lg hover:bg-zinc-800/60 hover:text-yellow transition-colors">
                        Services & Tuning
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/#gallery" className="p-2 rounded-lg hover:bg-zinc-800/60 hover:text-yellow transition-colors">
                        Custom Builds
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/accessories" className="p-2 rounded-lg hover:bg-zinc-800/60 hover:text-yellow transition-colors flex items-center justify-between">
                        <span>Accessories Vault</span>
                        <span className="text-[9px] bg-yellow/15 text-yellow px-2 py-0.5 rounded font-bold">STORE</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/cart" className="p-2 rounded-lg hover:bg-zinc-800/60 hover:text-yellow transition-colors flex items-center justify-between">
                        <span>Shopping Cart</span>
                        {count > 0 && (
                          <span className="text-[9px] bg-yellow text-black px-2 py-0.5 rounded-full font-bold">{count}</span>
                        )}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/#contact" className="p-2 rounded-lg hover:bg-zinc-800/60 hover:text-yellow transition-colors">
                        Contact & Garage
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/80 space-y-3">
                  <SheetClose asChild>
                    <Link
                      to="/book-service"
                      className="btn-yellow w-full justify-center text-center py-2.5 text-xs block"
                    >
                      Book Service Slot
                    </Link>
                  </SheetClose>
                  <a
                    href="https://wa.me/917892318639"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost-yellow w-full justify-center text-center py-2 text-xs flex items-center gap-1.5"
                  >
                    <span>WhatsApp Garage</span>
                  </a>
                  <p className="text-center text-[10px] text-zinc-500 font-body tracking-wider uppercase pt-1">
                    Mangaluru, Karnataka
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
