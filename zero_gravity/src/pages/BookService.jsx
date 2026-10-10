import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { WHATSAPP_NUMBER } from "@/lib/cart";
import { useSEO } from "@/lib/useSEO";
import {
  User,
  Phone,
  Bike,
  Calendar,
  MessageCircle,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Gauge,
  Wrench,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const SERVICE_OPTIONS = [
  { id: "Bike Modification", label: "Bike Modification", icon: SlidersHorizontal },
  { id: "Custom Builds", label: "Custom Builds", icon: Flame },
  { id: "Performance Upgrades", label: "Performance Tuning", icon: Gauge },
  { id: "Servicing", label: "Periodic Servicing", icon: Wrench },
  { id: "Custom Paint & Detailing", label: "Paint & Detailing", icon: Sparkles },
];

export default function BookService() {
  useSEO({
    title: "Book Service Slot | Custom Modifications & Performance Tuning — ZERO GRAVITY",
    description: "Schedule your custom bike modification, performance tuning, periodic servicing, or detailing appointment at Zero Gravity garage in Mangaluru.",
    keywords: "book bike service, superbike service Mangaluru, custom bike modification booking, motorcycle dyno tuning, periodic bike maintenance, custom paint jobs, Zero Gravity service"
  });

  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [serviceType, setServiceType] = useState(SERVICE_OPTIONS[0].id);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (requestedService) {
      const match = SERVICE_OPTIONS.find(
        (s) => s.id.toLowerCase() === requestedService.toLowerCase() || s.label.toLowerCase() === requestedService.toLowerCase()
      );
      if (match) {
        setServiceType(match.id);
      }
    }
  }, [requestedService]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getWhatsAppLink = () => {
    const text =
      `Hi ZERO GRAVITY, I'd like to book a service slot:\n\n` +
      `• Name: ${name}\n` +
      `• Phone: ${phone}\n` +
      `• Bike: ${bikeBrand} ${bikeModel}\n` +
      `• Discipline: ${serviceType}\n` +
      `• Preferred Date: ${date || "Flexible"}\n` +
      `• Notes: ${notes || "None"}`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="relative bg-[#08090d] text-foreground min-h-screen flex flex-col justify-between">
      <Nav />

      {/* Header */}
      <section className="relative pt-24 sm:pt-28 pb-8 sm:pb-10 px-4 sm:px-6 border-b border-zinc-800/80 overflow-hidden bg-[#08090d]">
        {/* Soft luxurious ambient radial glow in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(229,169,59,0.12),transparent_75%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow/10 border border-yellow/20 text-yellow text-xs font-medium tracking-wider uppercase mb-3.5 font-body">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
            Workshop Reservation
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-foreground tracking-tight">
            Book Your <span className="text-yellow">Service Slot</span>
          </h1>
          <p className="mt-3.5 text-foreground/75 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed font-body">
            Schedule your bespoke build, performance upgrades, or factory-grade maintenance at our Mangaluru studio.
          </p>
        </div>
      </section>

      {/* Main Form & Sidebar Section */}
      <section className="py-6 sm:py-10 px-4 sm:px-6 flex-1 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Column (8 cols) */}
          <div className="lg:col-span-8">
            <motion.div
              className="card-dark p-5 sm:p-8 md:p-10 rounded-2xl border border-zinc-800/90 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Rider Information */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-yellow mb-3 font-body flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow/15 border border-yellow/30 text-yellow flex items-center justify-center text-[11px] font-bold">1</span>
                      Rider Information
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/70 font-medium font-body">Your Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sagar Shetty"
                            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-yellow focus:ring-1 focus:ring-yellow/40 outline-none pl-10 pr-3.5 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/45 transition-all font-body"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/70 font-medium font-body">Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. 7892318639"
                            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-yellow focus:ring-1 focus:ring-yellow/40 outline-none pl-10 pr-3.5 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/45 transition-all font-body"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Machine Details */}
                  <div className="pt-2 border-t border-zinc-800/60">
                    <div className="text-xs font-semibold uppercase tracking-wider text-yellow mb-3 font-body flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow/15 border border-yellow/30 text-yellow flex items-center justify-center text-[11px] font-bold">2</span>
                      Machine Details
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/70 font-medium font-body">Bike Make / Brand</label>
                        <div className="relative">
                          <Bike className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            required
                            type="text"
                            value={bikeBrand}
                            onChange={(e) => setBikeBrand(e.target.value)}
                            placeholder="e.g. Royal Enfield / Yamaha / KTM"
                            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-yellow focus:ring-1 focus:ring-yellow/40 outline-none pl-10 pr-3.5 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/45 transition-all font-body"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/70 font-medium font-body">Model &amp; Year</label>
                        <input
                          required
                          type="text"
                          value={bikeModel}
                          onChange={(e) => setBikeModel(e.target.value)}
                          placeholder="e.g. Continental GT 650 (2024)"
                          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-yellow focus:ring-1 focus:ring-yellow/40 outline-none px-3.5 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/45 transition-all font-body"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Service Discipline Chips */}
                  <div className="pt-2 border-t border-zinc-800/60">
                    <div className="text-xs font-semibold uppercase tracking-wider text-yellow mb-3 font-body flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow/15 border border-yellow/30 text-yellow flex items-center justify-center text-[11px] font-bold">3</span>
                      Select Service Discipline
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SERVICE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = serviceType === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setServiceType(opt.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 font-body ${
                              isSelected
                                ? "bg-yellow/15 border-yellow text-foreground shadow-[0_0_15px_rgba(229,169,59,0.18)]"
                                : "bg-zinc-900/60 border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <Icon className={`w-4 h-4 ${isSelected ? "text-yellow" : "text-zinc-500"}`} />
                              {isSelected && <span className="w-2 h-2 rounded-full bg-yellow" />}
                            </div>
                            <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Preferred Date & Notes */}
                  <div className="pt-2 border-t border-zinc-800/60">
                    <div className="text-xs font-semibold uppercase tracking-wider text-yellow mb-3 font-body flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-yellow/15 border border-yellow/30 text-yellow flex items-center justify-center text-[11px] font-bold">4</span>
                      Schedule &amp; Specifics
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/70 font-medium font-body">Preferred Appointment Date</label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            required
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-yellow focus:ring-1 focus:ring-yellow/40 outline-none pl-10 pr-3.5 py-2.5 rounded-xl text-sm text-foreground transition-all cursor-pointer font-body"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/70 font-medium font-body">
                          Modification or Servicing Requirements (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Custom clip-ons, free-flow exhaust fitment, ECU map, full fluid flush, specific paint scheme..."
                          className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-yellow focus:ring-1 focus:ring-yellow/40 outline-none p-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/45 transition-all resize-none font-body"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full btn-yellow justify-center py-3.5 rounded-xl text-sm font-bold tracking-wide cursor-pointer shadow-lg hover:shadow-yellow-sm flex items-center gap-2"
                  >
                    <span>Proceed to WhatsApp Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Confirmation Ticket */
                <motion.div
                  className="py-4 space-y-6 font-body"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-yellow/15 border border-yellow text-yellow flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">Booking Ticket Generated</h3>
                      <p className="text-xs text-zinc-400">Review your details and tap below to send directly to our workshop on WhatsApp.</p>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-zinc-950/90 rounded-xl border border-zinc-800 p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Rider</span>
                      <span className="text-foreground font-semibold">{name} ({phone})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Machine</span>
                      <span className="text-foreground font-semibold">{bikeBrand} {bikeModel}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Discipline</span>
                      <span className="text-yellow font-semibold">{serviceType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Requested Date</span>
                      <span className="text-foreground font-semibold">{date}</span>
                    </div>
                    {notes && (
                      <div className="pt-1">
                        <span className="text-zinc-500 block mb-1">Notes:</span>
                        <p className="text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg text-xs leading-relaxed">{notes}</p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Action */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 btn-yellow justify-center py-3.5 rounded-xl font-bold cursor-pointer shadow-lg text-center flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-ghost-yellow justify-center py-3.5 px-6 rounded-xl cursor-pointer flex items-center gap-2 text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Garage Info Card */}
            <div className="card-dark p-5 sm:p-6 rounded-2xl border border-zinc-800/90 font-body space-y-4">
              <h4 className="font-display font-bold text-sm tracking-wider uppercase text-yellow">
                Workshop Studio
              </h4>
              <div className="space-y-3.5 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium block">Zero Gravity Garage</span>
                    <span className="text-zinc-400">Pam Arcade, Kulur Ferry Rd, Kottara, Mangaluru, Karnataka 575006</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium block">Working Hours</span>
                    <span className="text-zinc-400">Mon – Sat: 9:30 AM – 8:00 PM</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium block">Direct Line</span>
                    <a href="tel:+917892318639" className="text-yellow hover:underline">
                      +91 78923 18639
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Zero Gravity Standard Card */}
            <div className="card-dark p-5 sm:p-6 rounded-2xl border border-zinc-800/90 font-body space-y-3">
              <h4 className="font-display font-bold text-sm tracking-wider uppercase text-yellow">
                The ZG Commitment
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-yellow shrink-0" />
                  <span>1-on-1 consultation with lead builders</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-yellow shrink-0" />
                  <span>Dedicated mechanical bay per machine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-yellow shrink-0" />
                  <span>Transparent timeline &amp; estimate before work</span>
                </li>
              </ul>
            </div>

            {/* Instant WhatsApp Help */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-body text-zinc-400 flex items-center justify-between gap-3">
              <span>Have quick questions first?</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Zero Gravity, I have a few questions before booking a service.")}`}
                target="_blank"
                rel="noreferrer"
                className="text-yellow hover:underline font-semibold shrink-0 flex items-center gap-1"
              >
                <span>Ask on WhatsApp</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
