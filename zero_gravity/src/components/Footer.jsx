import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-yellow/10 py-10 sm:py-12 px-4 sm:px-6 bg-black/40">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="font-display font-black tracking-[0.3em] sm:tracking-[0.4em] text-yellow text-base sm:text-lg">ZERO GRAVITY</div>
            <p className="text-xs text-foreground/50 mt-2.5 sm:mt-3 leading-relaxed max-w-xs font-body">
              The Bikers Destination. Premium modification, custom builds & curated riding gear — engineered for obsession.
            </p>
          </div>
          <div className="text-sm">
            <div className="text-[10px] tracking-[0.3em] uppercase text-yellow mb-3 font-semibold">Explore</div>
            <ul className="space-y-2 text-foreground/70 font-body text-xs sm:text-sm">
              <li><Link to="/#about" className="hover:text-yellow transition-colors inline-block py-0.5">About</Link></li>
              <li><Link to="/#services" className="hover:text-yellow transition-colors inline-block py-0.5">Services</Link></li>
              <li><Link to="/accessories" className="hover:text-yellow transition-colors inline-block py-0.5">Accessories</Link></li>
              <li><Link to="/cart" className="hover:text-yellow transition-colors inline-block py-0.5">Cart</Link></li>
              <li><Link to="/#contact" className="hover:text-yellow transition-colors inline-block py-0.5">Contact</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="text-[10px] tracking-[0.3em] uppercase text-yellow mb-3 font-semibold">Garage</div>
            <p className="text-foreground/70 leading-relaxed font-body text-xs sm:text-sm">
              Pam Arcade, Kulur Ferry Rd,<br />Kottara, Mangaluru, KA 575006
            </p>
            <p className="text-foreground/70 mt-3 font-body text-xs sm:text-sm">
              <a href="tel:+917892318639" className="hover:text-yellow transition-colors inline-block py-0.5 font-medium text-white">078923 18639</a>
            </p>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body">
          <p className="text-[10px] sm:text-xs text-foreground/50 tracking-[0.25em] sm:tracking-[0.3em] uppercase text-center sm:text-left">
            © {new Date().getFullYear()} · ZERO GRAVITY · BUILT TO DEFY
          </p>
          <p className="text-[11px] sm:text-xs text-foreground/50 text-center sm:text-right">
            Developed and Managed by{" "}
            <a
              href="https://workingdots.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow hover:underline font-semibold transition-colors"
            >
              Working Dots
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
