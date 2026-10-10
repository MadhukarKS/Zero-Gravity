import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HeroAnimation from "@/components/HeroAnimation";
import FloatingParts from "@/components/FloatingParts";
import LoadingScreen from "@/components/LoadingScreen";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import himalayanYellow from "@/assets/himalayan-yellow.jpg";
import bikeRx100 from "@/assets/bike-rx100.jpg";
import bikeR15 from "@/assets/bike-r15.jpg";
import bikeGt650 from "@/assets/bike-gt650.jpg";
import { motion } from "motion/react";
import { PackageOpen, Phone, MessageCircle, MapPin, Clock, ArrowUpRight, Star } from "lucide-react";
import { fetchPublicProducts } from "@/lib/supabase";
import { useSEO } from "@/lib/useSEO";

const SERVICES = [
  {
    title: "Bike Modification",
    desc: "Bespoke aesthetic & ergonomic transformations tuned to your riding style.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="6" cy="17" r="4" /><circle cx="18" cy="17" r="4" />
        <path d="M6 17l4-9h6l2 5" /><path d="M10 8h4" />
      </svg>
    ),
  },
  {
    title: "Custom Builds",
    desc: "Ground-up cafe racers, trackers and streetfighters engineered to obsess over.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 12h4l2-3h6l3 4h3v4h-5" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
  {
    title: "Performance Upgrades",
    desc: "ECU remaps, exhaust systems, suspension and brake upgrades. Numbers that matter.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Servicing",
    desc: "Factory-grade service, diagnostics and fluid systems. Precision, every cycle.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.3 2.3-2.1-2.1z" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Menon",
    bike: "Kawasaki Ninja ZX-10R",
    service: "Custom Fairing & ECU Map",
    text: "Brought my ZX-10R in for full track fairings and ECU remapping. Shreyas and the Zero Gravity crew dialed it in to perfection. The mid-range throttle punch is ferocious, and the finish looks straight out of a WSBK paddock.",
    rating: 5,
    tag: "Verified Build",
  },
  {
    name: "Karthik Rao",
    bike: "Continental GT 650",
    service: "Cafe Racer Conversion",
    text: "Turned my stock GT 650 into a true cafe racer masterpiece. Custom clip-ons, hand-stitched leather cowl, and a custom exhaust note that turns heads across Mangalore. Pure metal artistry.",
    rating: 5,
    tag: "Custom Build",
  },
  {
    name: "Naveen D'Souza",
    bike: "Yamaha RX 100",
    service: "Vintage Restoration",
    text: "My dad's 1996 RX 100 was sitting idle for 8 years. Zero Gravity brought it back to showroom glory. Crisp 2-stroke exhaust resonance, flawless gloss paint, and factory-spec rebuild. Pure nostalgia restored.",
    rating: 5,
    tag: "Restoration",
  },
  {
    name: "Vikrant Shetty",
    bike: "BMW S1000RR",
    service: "Track Day Prep",
    text: "Installed race-spec titanium headers, carbon winglets, and track sliders before my BIC track weekend. Rock solid fitment and zero vibrations at 260+ km/h. Wouldn't trust any other garage with my liter bike.",
    rating: 5,
    tag: "Performance",
  },
  {
    name: "Aditya Hegde",
    bike: "RE Himalayan 450",
    service: "Expedition Touring Package",
    text: "Prepped my Himalayan 450 for a Spiti Valley run. Heavy-duty crash protection, custom fog light mounts, and tailored touring ergonomics. 4,000 km of brutal terrain and not a single rattle. Uncompromising engineering.",
    rating: 5,
    tag: "Adventure",
  },
  {
    name: "Rhea Kunder",
    bike: "Ducati Monster 821",
    service: "Desmo Care & Tail Tidy",
    text: "Hard to find workshops in coastal Karnataka that you can genuinely trust with an Italian twin. The craftsmanship, electrical wiring tuck, and personalized passion from the Zero Gravity team is unmatched.",
    rating: 5,
    tag: "Verified Rider",
  },
  {
    name: "Praneeth Kumar",
    bike: "KTM 390 Duke",
    service: "Quickshifter & Tuning",
    text: "Quick turnaround for high-ratio sprocket setup, BMC air filter, and dyno check. The bike pulls like a rocket out of corners. Best place in town for riders who take performance seriously.",
    rating: 5,
    tag: "Tuning",
  },
  {
    name: "Darshan Gowda",
    bike: "Triumph Street Triple RS",
    service: "Track-Grade Protection",
    text: "Ordered a race-spec helmet, armored riding jacket, and custom engine sliders through their WhatsApp catalog. Instant dispatch and 100% genuine track-grade equipment. My permanent motorcycle gear vault.",
    rating: 5,
    tag: "Gear Vault",
  },
];

function SectionLabel({ kicker, title, sub }) {
  return (
    <div className="text-center mb-10 sm:mb-14 px-2">
      <div className="text-yellow text-[11px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-2 sm:mb-3 font-semibold">— {kicker} —</div>
      <h2 className="font-display font-black text-3xl sm:text-4xl md:text-6xl text-foreground tracking-tight">
        {title}
      </h2>
      {sub && <p className="mt-3 sm:mt-4 text-foreground/60 max-w-2xl mx-auto font-body text-xs sm:text-sm md:text-base leading-relaxed">{sub}</p>}
    </div>
  );
}

export default function Home() {
  useSEO({
    title: "ZERO GRAVITY — The Bikers Destination | Custom Builds & Superbike Studio",
    description: "Mangaluru's premier superbike modification studio, bespoke custom bike builder, performance tuning center, and motorcycle accessories store.",
    keywords: "Zero Gravity, Zero Gravity Mangaluru, bike modification Mangaluru, superbike custom builds, Himalayan 450 modification, Continental GT650, Yamaha RX100 custom, motorcycle performance tuning, Mangaluru garage"
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      try {
        const { data, error } = await fetchPublicProducts();
        if (!error && mounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Failed to load products for homepage:", err);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    }
    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div id="top" className="relative bg-background text-foreground">
      <LoadingScreen />
      <Nav />

      {/* HERO — full viewport */}
      <section className="relative h-[100svh] w-full overflow-hidden bg-grid">
        {/* Vertical side rail — left */}
        <div className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-6 text-[10px] tracking-[0.5em] uppercase text-foreground/50">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rotate-180 [writing-mode:vertical-rl] hover:text-yellow transition">Instagram</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="rotate-180 [writing-mode:vertical-rl] hover:text-yellow transition">YouTube</a>
          <a href="https://wa.me/917892318639" target="_blank" rel="noreferrer" className="rotate-180 [writing-mode:vertical-rl] hover:text-yellow transition">WhatsApp</a>
        </div>
        {/* Vertical side rail — right */}
        <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-end gap-3">
          <div className="h-24 w-px bg-yellow/40" />
          <span className="[writing-mode:vertical-rl] text-[10px] tracking-[0.5em] uppercase text-yellow">EST · 2014</span>
          <div className="h-24 w-px bg-yellow/40" />
        </div>

        <HeroAnimation />
      </section>

      {/* Specialties marquee — sits right under the hero */}
      <section className="relative border-y border-border bg-background/80 backdrop-blur-md overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { k: "01", t: "Custom Builds", s: "Ground-up obsession" },
            { k: "02", t: "Performance", s: "Tuned for the limit" },
            { k: "03", t: "Modifications", s: "Aesthetic + ergonomic" },
            { k: "04", t: "Service & Care", s: "Factory-grade detail" },
          ].map((it) => (
            <Link
              key={it.k}
              to="/#services"
              className="group px-3 sm:px-4 py-3.5 sm:py-5 flex items-center gap-2.5 sm:gap-3 hover:bg-yellow/5 transition-colors duration-300"
            >
              <span className="font-display font-black text-yellow/70 text-base sm:text-lg md:text-xl group-hover:text-yellow transition-colors duration-300 shrink-0">
                {it.k}
              </span>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs sm:text-sm md:text-base truncate">{it.t}</div>
                <div className="text-[9px] sm:text-[10px] md:text-xs text-foreground/50 tracking-wider sm:tracking-widest uppercase truncate font-body">
                  {it.s}
                </div>
              </div>
              <span className="ml-auto text-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline">→</span>
            </Link>
          ))}
        </div>
        <div className="border-t border-border overflow-hidden">
          <div
            className="flex gap-10 whitespace-nowrap py-2.5 text-[10px] tracking-[0.5em] uppercase text-foreground/60"
            style={{ animation: "marquee 28s linear infinite", width: "max-content" }}
          >
            {Array.from({ length: 2 }).map((_, r) => (
              <div key={r} className="flex gap-10 px-6">
                {[
                  "★ Custom Superbikes",
                  "★ Cafe Racers",
                  "★ Adventure Builds",
                  "★ ECU Remaps",
                  "★ Titanium Exhausts",
                  "★ Carbon Fairings",
                  "★ Track Day Prep",
                  "★ Himalayan Specialists",
                ].map((t, i) => (
                  <span key={i} className={i % 3 === 0 ? "text-yellow" : ""}>{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <motion.section
        id="about"
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloatingParts />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-yellow text-[11px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-3 font-semibold">— Our Story —</div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              Built for <span className="text-yellow">Riders</span>,<br />
              Not Just Bikes.
            </h2>
            <p className="mt-4 sm:mt-6 text-foreground/75 leading-relaxed text-xs sm:text-sm md:text-base font-body">
              ZERO GRAVITY is where steel becomes sculpture and machines become extensions of the rider. Born in a garage, raised on adrenaline — we obsess over every bolt, weld and curve so your bike feels like nothing else on the road.
            </p>
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-6 max-w-md">
              {[
                ["1200+", "Builds"],
                ["10 yrs", "Wrenching"],
                ["48+", "Awards"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-yellow">{n}</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-foreground/50 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -inset-4 bg-yellow/15 blur-3xl rounded-full" />
            <img
              src={himalayanYellow}
              alt="ZG Royal Enfield Himalayan — black & yellow build"
              loading="lazy"
              width={1600}
              height={900}
              className="relative w-full h-auto rounded-xl border border-border"
            />
            <div className="absolute bottom-3 right-3 sm:-bottom-4 sm:-right-4 bg-yellow text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-display font-black tracking-wider sm:tracking-widest rounded-lg shadow-lg">
              HIMALAYAN · ZG EDITION
            </div>
          </motion.div>
        </div>

        {/* FOUNDER MESSAGE CARD */}
        <div className="max-w-5xl mx-auto mt-14 sm:mt-24 relative">
          <motion.div
            className="card-dark p-6 sm:p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -top-8 -left-4 sm:-top-10 sm:-left-6 text-yellow/10 font-display font-black text-[90px] sm:text-[140px] md:text-[160px] leading-none select-none pointer-events-none">"</div>
            <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
              <div className="flex md:flex-col items-center md:items-start gap-3 sm:gap-4">
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center font-display font-black text-yellow text-lg sm:text-xl shadow-inner shrink-0">
                  S
                </div>
                <div className="md:mt-2">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-yellow font-semibold">Founder</div>
                  <div className="font-display text-base sm:text-lg font-black mt-0.5">Shreyas</div>
                </div>
              </div>
              <div className="space-y-3.5 sm:space-y-4 text-foreground/80 leading-relaxed text-xs sm:text-sm md:text-base font-body">
                <p>Hi, I'm <span className="text-yellow font-semibold">Shreyas</span>.</p>
                <p>I was once an animator — but my passion was always somewhere else. In motorsports, in machines, and in the art of modification.</p>
                <p>That passion kept growing stronger every day, until I made a decision to follow it completely. What started as an interest soon turned into something much bigger.</p>
                <p>That's how <span className="text-yellow font-semibold">Zero Gravity</span> was born.</p>
                <p>Today, Zero Gravity stands as a brand built on passion, precision, and trust — recognized across India and by enthusiasts around the world.</p>
                <p className="text-foreground font-medium">This isn't just a business for me. It's what I love, every single day.</p>
                <div className="pt-3 sm:pt-4 flex items-center gap-3">
                  <div className="h-px w-8 sm:w-10 bg-yellow/40" />
                  <span className="font-display italic text-yellow tracking-[0.25em] sm:tracking-[0.3em] text-[11px] sm:text-xs">SHREYAS · FOUNDER</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <motion.section
        id="services"
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-background via-card/25 to-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel
            kicker="What We Do"
            title="Engineered Obsession"
            sub="Four disciplines. One uncompromising standard."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                className="card-dark p-6 sm:p-8 group relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute top-3 right-4 text-yellow/15 font-display text-4xl font-black">
                  0{i + 1}
                </div>
                <div className="text-yellow mb-5 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl mb-2">{s.title}</h3>
                <p className="text-foreground/65 text-xs sm:text-sm leading-relaxed font-body">{s.desc}</p>
                <div className="mt-5 sm:mt-6 text-yellow text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn More →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GALLERY */}
      <motion.section
        id="gallery"
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <FloatingParts />
        <div className="max-w-7xl mx-auto relative">
          <SectionLabel
            kicker="The Garage"
            title="Indian Icons, Reimagined"
            sub="From the legendary RX100 to the modern R15 and Continental GT 650 — Indian machines re-engineered with ZG obsession."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { src: bikeRx100, tag: "Restomod · 01", name: "Yamaha RX100", spec: "2-Stroke Revival" },
              { src: bikeR15, tag: "Custom · 02", name: "Yamaha R15", spec: "Track-Spec Build" },
              { src: bikeGt650, tag: "Cafe Racer · 03", name: "Continental GT 650", spec: "Bobber Reborn" },
            ].map((b, i) => (
              <motion.div
                key={b.name}
                className="relative group overflow-hidden rounded-xl border border-border shadow-md"
                initial={{ opacity: 0, scale: 0.96, y: 25 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="overflow-hidden aspect-square">
                  <img
                    src={b.src}
                    alt={b.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-yellow text-[11px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase font-semibold">{b.tag}</div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mt-1 text-white">{b.name}</h3>
                  <div className="text-[11px] sm:text-xs text-white/70 tracking-wider sm:tracking-widest uppercase mt-1 font-body">{b.spec}</div>
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-yellow/30 bg-black/50 flex items-center justify-center text-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ↗
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ACCESSORIES TEASER */}
      <motion.section
        id="shop"
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 bg-card/20 border-y border-border"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel
            kicker="Gear Up"
            title="Premium Accessories"
            sub="Helmets · Jackets · Gloves · Boots · Exhausts · Eyewear — every riding gear you need, curated and ZG-approved."
          />
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#12141c]/60 border border-zinc-800/60 overflow-hidden animate-pulse flex flex-col"
                >
                  <div className="aspect-square bg-zinc-800/40 w-full" />
                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                    <div className="h-4 w-3/4 bg-zinc-800/70 rounded" />
                    <div className="h-6 w-1/2 bg-zinc-800/70 rounded mt-4" />
                    <div className="grid grid-cols-2 gap-2 pt-2 mt-auto">
                      <div className="h-9 bg-zinc-800/60 rounded-xl" />
                      <div className="h-9 bg-zinc-800/60 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl bg-[#11131a] border border-zinc-800 p-6 sm:p-8 md:p-12 text-center max-w-xl mx-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-4">
                <PackageOpen className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-white mb-2">
                Accessories Vault Updating Soon
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Our upcoming collection of factory-spec gear, helmets, and performance components is currently being cataloged. Reach out to us directly for live stock availability.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/917892318639?text=Hi%20Zero%20Gravity,%20I'd%20like%20to%20inquire%20about%20accessories%20and%20riding%20gear."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-yellow text-xs cursor-pointer w-full sm:w-auto text-center justify-center"
                >
                  Inquire on WhatsApp →
                </a>
                <Link to="/book-service" className="btn-ghost-yellow text-xs w-full sm:w-auto text-center justify-center">
                  Book Bike Service
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {products.slice(0, 4).map((prod) => (
                  <ProductCard key={prod.product_id || prod.id} product={prod} />
                ))}
              </div>
              <div className="text-center mt-10 sm:mt-12">
                <Link to="/accessories" className="btn-yellow w-full sm:w-auto text-center justify-center">
                  Explore All Accessories ({products.length}) →
                </Link>
                <div className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-foreground/50 mt-3 sm:mt-4 font-semibold">
                  Live inventory from database · Add to cart · Order on WhatsApp
                </div>
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* TESTIMONIALS - INFINITE MARQUEE */}
      <motion.section
        className="relative py-12 sm:py-16 overflow-hidden border-t border-zinc-800/80 bg-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <FloatingParts />
        <div className="relative">
          <SectionLabel
            kicker="Rider Intel"
            title={
              <>
                Tested By The <span className="text-[#e5a93b]">Obsessed</span>
              </>
            }
            sub="From canyon-carving liter bikes to vintage two-stroke restorations — unfiltered feedback from riders who push our machines to the edge."
          />

          {/* Infinite Marquee Reel (Left-to-Right Scrolling) */}
          <div className="relative w-full overflow-hidden mt-6">
            {/* Left & Right Subtle Fade Gradients */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

            {/* Scrolling Track */}
            <div className="flex gap-4 sm:gap-6 animate-marquee-scroll w-max py-2">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                <figure
                  key={`${t.name}-${idx}`}
                  className="w-[310px] sm:w-[380px] shrink-0 card-dark p-5 sm:p-6 rounded-2xl flex flex-col justify-between border border-zinc-800 hover:border-[#e5a93b]/70 transition-colors select-none bg-[#10121a]"
                >
                  <div>
                    {/* Header: Star Rating + Tag */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-1 text-[#e5a93b]">
                        {[...Array(t.rating || 5)].map((_, si) => (
                          <Star key={si} className="w-3.5 h-3.5 fill-[#e5a93b]" />
                        ))}
                      </div>
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        {t.tag}
                      </span>
                    </div>

                    {/* Review Quote */}
                    <blockquote className="text-zinc-300 leading-relaxed text-xs sm:text-sm font-body">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                  </div>

                  {/* Rider Info & Service */}
                  <figcaption className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-display font-bold text-sm text-white">{t.name}</div>
                      <div className="text-[11px] text-[#e5a93b] font-medium tracking-wide mt-0.5">
                        {t.bike}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium text-right">
                      {t.service}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CONTACT */}
      {/* CONTACT & WORKSHOP LOCATION */}
      <motion.section
        id="contact"
        className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-[#0a0b0e] to-[#050608] border-t border-zinc-800"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel
            kicker="Base Coordinates"
            title={
              <>
                Where Machines <span className="text-[#e5a93b]">Defy Gravity</span>
              </>
            }
            sub="Our doors are open at Kottara, Mangaluru. From radical bespoke builds to precision track tuning — experience where the obsession takes shape."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Card: Contact Details (5 cols) */}
            <div className="lg:col-span-5 card-dark p-6 sm:p-8 flex flex-col justify-between border border-zinc-800 rounded-2xl bg-[#0f1118]">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#e5a93b] font-bold block">
                      Direct Channel
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                      Get In Touch
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Crew Online</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {/* Phone */}
                  <a
                    href="tel:+917892318639"
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-[#e5a93b]/60 hover:bg-zinc-800/60 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#e5a93b]/10 text-[#e5a93b] border border-[#e5a93b]/30 flex items-center justify-center group-hover:bg-[#e5a93b] group-hover:text-black transition-all duration-300 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] tracking-wider uppercase text-zinc-500 font-semibold">
                        Call Us Directly
                      </div>
                      <div className="font-display text-base font-bold text-white group-hover:text-[#e5a93b] transition-colors">
                        078923 18639
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/917892318639?text=Hi%20Zero%20Gravity,%20I'd%20like%20to%20discuss%20a%20bike%20build%20and%20service."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-[#e5a93b]/60 hover:bg-zinc-800/60 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] tracking-wider uppercase text-zinc-500 font-semibold">
                        Instant WhatsApp Chat
                      </div>
                      <div className="font-display text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Chat With The Crew
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Workshop Address */}
                  <a
                    href="https://maps.app.goo.gl/JkBbpEcJwfmT5D3P8"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-[#e5a93b]/60 hover:bg-zinc-800/60 transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#e5a93b]/10 text-[#e5a93b] border border-[#e5a93b]/30 flex items-center justify-center group-hover:bg-[#e5a93b] group-hover:text-black transition-all duration-300 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] tracking-wider uppercase text-zinc-500 font-semibold">
                        Workshop Address
                      </div>
                      <div className="font-body text-xs sm:text-sm font-semibold text-white leading-snug mt-0.5">
                        Pam Arcade, Kulur Ferry Rd, Kottara, Mangaluru, KA 575006
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Hours */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                    <div className="w-11 h-11 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="text-[10px] tracking-wider uppercase text-zinc-500 font-semibold">
                        Operating Hours
                      </div>
                      <div className="font-medium text-zinc-200 mt-0.5">
                        Mon – Sat: 9:30 AM – 8:30 PM
                      </div>
                      <div className="text-zinc-500 text-[11px]">
                        Sunday: By Appointment
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+917892318639"
                  className="btn-yellow flex-1 justify-center text-center text-xs py-3"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Garage</span>
                </a>
                <a
                  href="https://wa.me/917892318639?text=Hi%20Zero%20Gravity,%20I'd%20like%20to%20discuss%20a%20bike%20build%20and%20service."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost-yellow flex-1 justify-center text-center text-xs py-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Card: Google Map (7 cols) */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0d12] shadow-2xl relative">
              {/* Map Top Bar with Directions CTA */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#12141c] border-b border-zinc-800 flex items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e5a93b] shrink-0" />
                  <span className="font-display font-bold text-xs sm:text-sm text-white tracking-wide truncate">
                    Zero Gravity · Kottara, Mangaluru
                  </span>
                </div>
                <a
                  href="https://maps.app.goo.gl/JkBbpEcJwfmT5D3P8"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e5a93b] hover:bg-[#f5af3f] text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-sm"
                >
                  <span>Open Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full">
                <iframe
                  title="Zero Gravity Workshop Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.3174205021297!2d74.83376297593673!3d12.907239287401918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35bed93571781%3A0xd330e185c5395c88!2sZero%20Gravity!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
