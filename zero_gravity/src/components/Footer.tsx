import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="border-t border-yellow/10 py-12 px-6 bg-black/40">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="font-display font-black tracking-[0.4em] text-yellow text-lg">ZERO GRAVITY</div>
          <p className="text-xs text-foreground/50 mt-3 leading-relaxed max-w-xs">
            The Bikers Destination. Premium modification, custom builds & curated riding gear — engineered for obsession.
          </p>
        </div>
        <div className="text-sm">
          <div className="text-[10px] tracking-[0.4em] uppercase text-yellow mb-3">Explore</div>
          <ul className="space-y-2 text-foreground/70">
            <li><Link to="/" hash="about" className="hover:text-yellow">About</Link></li>
            <li><Link to="/" hash="services" className="hover:text-yellow">Services</Link></li>
            <li><Link to="/accessories" className="hover:text-yellow">Accessories</Link></li>
            <li><Link to="/cart" className="hover:text-yellow">Cart</Link></li>
            <li><Link to="/" hash="contact" className="hover:text-yellow">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="text-[10px] tracking-[0.4em] uppercase text-yellow mb-3">Garage</div>
          <p className="text-foreground/70 leading-relaxed">
            Pam Arcade, Kulur Ferry Rd,<br />Kottara, Mangaluru, KA 575006
          </p>
          <p className="text-foreground/70 mt-3">
            <a href="tel:+917892318639" className="hover:text-yellow">078923 18639</a>
          </p>
        </div>
      </div>
      <p className="text-[10px] text-foreground/40 mt-10 tracking-[0.4em] uppercase text-center">
        © {new Date().getFullYear()} · Zero Gravity · Built To Defy
      </p>
    </footer>
  );
}
