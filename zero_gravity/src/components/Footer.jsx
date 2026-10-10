import { Link } from "react-router-dom";
import zeroGravityLogo from "@/assets/zero_gravity.jpeg";
import {
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  MessageCircle,
  Instagram,
  Youtube,
  Wrench,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#08090d] pt-14 pb-8 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-zinc-800/70">
          {/* Col 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={zeroGravityLogo}
                alt="Zero Gravity"
                className="w-11 h-11 rounded-xl object-cover border border-[#e5a93b]/40 shadow-sm"
              />
              <div>
                <span className="font-display font-black tracking-[0.25em] text-[#e5a93b] text-lg block leading-none">
                  ZERO GRAVITY
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-semibold mt-1 block">
                  The Bikers Destination
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-body">
              Mangaluru&apos;s premier superbike modification studio, custom machine builds &amp; curated riding gear platform — engineered for obsession.
            </p>

            {/* Social & Contact Badges */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://wa.me/917892318639"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#e5a93b] text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800/80 flex items-center justify-center transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#e5a93b] text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800/80 flex items-center justify-center transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#e5a93b] text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800/80 flex items-center justify-center transition-all cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.google.com/maps?q=Pam+Arcade+Kulur+Ferry+Rd+Kottara+Mangaluru+Karnataka+575006"
                target="_blank"
                rel="noreferrer"
                aria-label="Google Maps"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#e5a93b] text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800/80 flex items-center justify-center transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#e5a93b] font-bold">
              Explore
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-body">
              <li>
                <Link to="/#about" className="hover:text-[#e5a93b] transition-colors inline-block py-0.5">
                  About Studio
                </Link>
              </li>
              <li>
                <Link to="/#services" className="hover:text-[#e5a93b] transition-colors inline-block py-0.5">
                  Services &amp; Builds
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="hover:text-[#e5a93b] transition-colors inline-block py-0.5">
                  Accessories Vault
                </Link>
              </li>
              <li>
                <Link to="/book-service" className="hover:text-[#e5a93b] transition-colors inline-block py-0.5">
                  Book Service Slot
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#e5a93b] transition-colors inline-block py-0.5">
                  View Cart
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-[#e5a93b] transition-colors inline-block py-0.5">
                  Contact Garage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Specialties (2.5 Cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#e5a93b] font-bold">
              Specialties
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-body">
              <li className="flex items-center gap-2 py-0.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Custom Bike Modification</span>
              </li>
              <li className="flex items-center gap-2 py-0.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Performance Upgrades &amp; Tuning</span>
              </li>
              <li className="flex items-center gap-2 py-0.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Exhaust Systems &amp; Fitments</span>
              </li>
              <li className="flex items-center gap-2 py-0.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Restorations &amp; Custom Paint</span>
              </li>
              <li className="flex items-center gap-2 py-0.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Periodic Maintenance &amp; Care</span>
              </li>
              <li className="flex items-center gap-2 py-0.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b]" />
                <span>Track-Spec Riding Gear</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Garage Headquarters & Hours (3 Cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#e5a93b] font-bold">
              Garage Station
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300 font-body">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#e5a93b] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-zinc-300">
                  Pam Arcade, Kulur Ferry Rd, Kottara, Mangaluru, KA 575006
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e5a93b] shrink-0" />
                <a
                  href="tel:+917892318639"
                  className="hover:text-[#e5a93b] transition-colors font-semibold text-white"
                >
                  078923 18639
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#e5a93b] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-zinc-300 font-medium">Mon – Sat: 9:30 AM – 8:30 PM</span>
                  <span className="block text-zinc-500 text-[11px]">Sunday: By Appointment</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.google.com/maps?q=Pam+Arcade+Kulur+Ferry+Rd+Kottara+Mangaluru+Karnataka+575006"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#e5a93b] hover:text-white transition-colors"
                >
                  <span>Get Directions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-body">
          {/* Left: Copyright */}
          <p className="text-[11px] sm:text-xs text-zinc-400 tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium text-center md:text-left">
            © {new Date().getFullYear()} ZERO GRAVITY · BUILT TO DEFY
          </p>

          {/* Right: Developed & Managed by Working Dots */}
          <p className="text-[11px] sm:text-xs text-zinc-400 text-center md:text-right flex items-center justify-center md:justify-end gap-1.5">
            <span>Developed and Managed by</span>
            <a
              href="https://workingdots.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-white hover:text-[#e5a93b] transition-colors group"
            >
              <span className="underline decoration-[#e5a93b]/60 underline-offset-4 group-hover:decoration-[#e5a93b]">
                Working Dots
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
