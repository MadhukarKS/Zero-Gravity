import { createFileRoute, Link } from "@tanstack/react-router";
import HeroAnimation from "@/components/HeroAnimation";
import FloatingParts from "@/components/FloatingParts";
import LoadingScreen from "@/components/LoadingScreen";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import himalayanYellow from "@/assets/himalayan-yellow.jpg";
import bikeRx100 from "@/assets/bike-rx100.jpg";
import bikeR15 from "@/assets/bike-r15.jpg";
import bikeGt650 from "@/assets/bike-gt650.jpg";
import { motion } from "motion/react";

import { ACCESSORIES } from "@/lib/accessories";
import { useCart, buildWhatsAppSingleUrl } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZERO GRAVITY — The Bikers Destination | Premium Bike Modification" },
      {
        name: "description",
        content:
          "ZERO GRAVITY is a premium superbike modification studio. Custom builds, performance upgrades, accessories and servicing — built for riders, not just bikes.",
      },
      { property: "og:title", content: "ZERO GRAVITY — The Bikers Destination" },
      {
        property: "og:description",
        content: "Premium bike modification, custom builds & performance upgrades.",
      },
    ],
  }),
  component: Index,
});

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
    name: "Arjun M.",
    bike: "Kawasaki Ninja ZX-10R",
    text: "They didn't modify my bike — they re-engineered my obsession. Every weld, every wire, premium.",
  },
  {
    name: "Rhea K.",
    bike: "Ducati Monster",
    text: "Walked in with a Monster. Walked out with a weapon. The detail is unreal.",
  },
  {
    name: "Vikrant S.",
    bike: "BMW S1000RR",
    text: "Track-day ready in two weeks. The bike feels lighter, sharper, faster. Worth every rupee.",
  },
];

function SectionLabel({ kicker, title, sub }) {
  return (
    <div className="text-center mb-14">
      <div className="text-yellow text-xs tracking-[0.5em] uppercase mb-3">— {kicker} —</div>
      <h2 className="font-display font-black text-4xl md:text-6xl text-foreground">
        {title}
      </h2>
      {sub && <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">{sub}</p>}
    </div>
  );
}

function Index() {
  const { add } = useCart();
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
              to="/"
              hash="services"
              className="group px-4 py-5 flex items-center gap-3 hover:bg-yellow/5 transition-colors duration-300"
            >
              <span className="font-display font-black text-yellow/70 text-lg md:text-xl group-hover:text-yellow transition-colors duration-300">
                {it.k}
              </span>
              <div className="min-w-0">
                <div className="font-display font-bold text-sm md:text-base truncate">{it.t}</div>
                <div className="text-[10px] md:text-xs text-foreground/50 tracking-widest uppercase truncate">
                  {it.s}
                </div>
              </div>
              <span className="ml-auto text-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
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
        className="relative py-28 px-6 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloatingParts />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-yellow text-xs tracking-[0.5em] uppercase mb-4">— Our Story —</div>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
              Built for <span className="text-yellow text-glow">Riders</span>,<br />
              Not Just Bikes.
            </h2>
            <p className="mt-6 text-foreground/75 leading-relaxed text-sm md:text-base font-body">
              ZERO GRAVITY is where steel becomes sculpture and machines become extensions of the rider. Born in a garage, raised on adrenaline — we obsess over every bolt, weld and curve so your bike feels like nothing else on the road.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
              {[
                ["1200+", "Builds"],
                ["10 yrs", "Wrenching"],
                ["48+", "Awards"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl md:text-3xl font-bold text-yellow">{n}</div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/50 mt-1">{l}</div>
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
            <div className="absolute -bottom-4 -right-4 bg-yellow text-primary-foreground px-4 py-2.5 text-xs font-display font-black tracking-widest rounded-lg shadow-lg">
              HIMALAYAN · ZG EDITION
            </div>
          </motion.div>
        </div>

        {/* FOUNDER MESSAGE CARD — sits just below the story */}
        <div className="max-w-5xl mx-auto mt-24 relative">
          <motion.div
            className="card-dark p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -top-10 -left-6 text-yellow/10 font-display font-black text-[160px] leading-none select-none pointer-events-none">"</div>
            <div className="relative grid md:grid-cols-[auto_1fr] gap-8 items-start">
              <div className="flex md:flex-col items-center md:items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center font-display font-black text-yellow text-xl shadow-inner">
                  S
                </div>
                <div className="md:mt-2">
                  <div className="text-[10px] tracking-[0.4em] uppercase text-yellow">Founder</div>
                  <div className="font-display text-lg font-black mt-0.5">Shreyas</div>
                </div>
              </div>
              <div className="space-y-4 text-foreground/80 leading-relaxed text-sm md:text-base font-body">
                <p>Hi, I'm <span className="text-yellow font-semibold">Shreyas</span>.</p>
                <p>I was once an animator — but my passion was always somewhere else. In motorsports, in machines, and in the art of modification.</p>
                <p>That passion kept growing stronger every day, until I made a decision to follow it completely. What started as an interest soon turned into something much bigger.</p>
                <p>That's how <span className="text-yellow font-semibold">Zero Gravity</span> was born.</p>
                <p>Today, Zero Gravity stands as a brand built on passion, precision, and trust — recognized across India and by enthusiasts around the world.</p>
                <p className="text-foreground font-medium">This isn't just a business for me. It's what I love, every single day.</p>
                <div className="pt-4 flex items-center gap-3">
                  <div className="h-px w-10 bg-yellow/40" />
                  <span className="font-display italic text-yellow tracking-[0.3em] text-xs">SHREYAS · FOUNDER</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <motion.section
        id="services"
        className="relative py-28 px-6 bg-gradient-to-b from-background via-card/25 to-background"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                className="card-dark p-8 group relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute top-3 right-4 text-yellow/15 font-display text-4xl font-black">
                  0{i + 1}
                </div>
                <div className="text-yellow mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed font-body">{s.desc}</p>
                <div className="mt-6 text-yellow text-xs tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn More →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* GALLERY — Indian Bikes */}
      <motion.section
        id="gallery"
        className="relative py-28 px-6 overflow-hidden"
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
          <div className="grid md:grid-cols-3 gap-6">
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
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-yellow text-xs tracking-[0.4em] uppercase">{b.tag}</div>
                  <h3 className="font-display text-2xl font-bold mt-1 text-white">{b.name}</h3>
                  <div className="text-xs text-white/70 tracking-widest uppercase mt-1">{b.spec}</div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-yellow/30 bg-black/40 flex items-center justify-center text-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        className="relative py-28 px-6 bg-card/20 border-y border-border"
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
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {ACCESSORIES.slice(0, 4).map((a, i) => {
              return (
                <motion.div
                  key={a.id}
                  className="card-dark overflow-hidden group flex flex-col"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <img
                      src={a.img}
                      alt={a.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-yellow text-primary-foreground text-[10px] font-display font-black tracking-widest px-2 py-1 rounded">
                      {a.cat}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="font-display font-bold text-sm md:text-base leading-tight">{a.name}</h3>
                      <p className="text-yellow text-sm mt-1 font-bold">{a.price}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => add({ id: a.id, name: a.name, cat: a.cat, price: a.price, img: a.img })}
                        className="text-[10px] tracking-[0.25em] uppercase border border-yellow/40 text-yellow rounded-md py-2 hover:bg-yellow hover:text-primary-foreground transition-all duration-300 cursor-pointer text-center font-semibold"
                      >
                        + Cart
                      </button>
                      <a
                        href={buildWhatsAppSingleUrl(a)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] tracking-[0.25em] uppercase bg-yellow text-primary-foreground rounded-md py-2 font-bold hover:brightness-110 transition-all duration-300 text-center flex items-center justify-center cursor-pointer"
                      >
                        Order
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/accessories" className="btn-yellow">
              Explore All Accessories →
            </Link>
            <div className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 mt-4 font-semibold">
              {ACCESSORIES.length}+ products · Add to cart · Order on WhatsApp
            </div>
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        className="relative py-28 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <FloatingParts />
        <div className="max-w-7xl mx-auto relative">
          <SectionLabel kicker="The Riders" title="Voices From The Road" />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                className="card-dark p-8 relative flex flex-col justify-between"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <div className="text-yellow font-display text-5xl leading-none mb-2 select-none">"</div>
                  <blockquote className="text-foreground/75 italic leading-relaxed text-sm font-body">
                    {t.text}
                  </blockquote>
                </div>
                <figcaption className="mt-6 pt-6 border-t border-border">
                  <div className="font-display font-bold text-base">{t.name}</div>
                  <div className="text-xs text-yellow tracking-widest uppercase mt-1 font-semibold">{t.bike}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        id="contact"
        className="relative py-28 px-6 bg-gradient-to-b from-background to-black border-t border-border"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionLabel kicker="Find Us" title="Roll Into The Garage" />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="card-dark p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold mb-6">Get In Touch</h3>
                <div className="space-y-5">
                  <a
                    href="tel:+917892318639"
                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-yellow/50 hover:bg-yellow/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow/10 text-yellow flex items-center justify-center group-hover:bg-yellow group-hover:text-primary-foreground transition-all duration-300 text-lg">
                      📞
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest uppercase text-foreground/50 font-semibold">Call</div>
                      <div className="font-display text-lg font-bold">078923 18639</div>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/917892318639"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-yellow/50 hover:bg-yellow/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow/10 text-yellow flex items-center justify-center group-hover:bg-yellow group-hover:text-primary-foreground transition-all duration-300 text-lg">
                      💬
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest uppercase text-foreground/50 font-semibold">WhatsApp</div>
                      <div className="font-display text-lg font-bold">Chat With The Crew</div>
                    </div>
                  </a>
                  <a
                    href="https://www.google.com/maps?q=Pam+Arcade+Kulur+Ferry+Rd+Kottara+Mangaluru+Karnataka+575006"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-yellow/50 hover:bg-yellow/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-full bg-yellow/10 text-yellow flex items-center justify-center group-hover:bg-yellow group-hover:text-primary-foreground transition-all duration-300 text-lg">
                      📍
                    </div>
                    <div className="min-w-0 font-body">
                      <div className="text-[10px] tracking-widest uppercase text-foreground/50 font-semibold">Garage</div>
                      <div className="font-display text-sm md:text-base leading-snug font-bold text-foreground">
                        Pam Arcade, Kulur Ferry Rd,<br />Kottara, Mangaluru, Karnataka 575006
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <a href="tel:+917892318639" className="btn-yellow flex-1 justify-center">Call Now</a>
                <a href="https://wa.me/917892318639" target="_blank" rel="noreferrer" className="btn-ghost-yellow flex-1 justify-center">WhatsApp</a>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-border min-h-[400px] shadow-lg">
              <iframe
                title="ZG Garage Location"
                src="https://www.google.com/maps?q=Pam+Arcade+Kulur+Ferry+Rd+Kottara+Mangaluru+Karnataka+575006&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none bg-yellow/5 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
