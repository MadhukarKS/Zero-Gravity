import { useState } from "react";
import { motion } from "motion/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { WHATSAPP_NUMBER } from "@/lib/cart";

const SERVICE_TYPES = [
  "Custom Bike Modification",
  "Performance Upgrades & Tuning",
  "Premium Accessories Fitment",
  "Periodic Servicing & Maintenance",
  "Custom Paint & Detailing",
];

export default function BookService() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getWhatsAppLink = () => {
    const text =
      `Hi ZERO GRAVITY, I'd like to book a service:\n\n` +
      `• Name: ${name}\n` +
      `• Phone: ${phone}\n` +
      `• Bike: ${bikeBrand} ${bikeModel}\n` +
      `• Service: ${serviceType}\n` +
      `• Date: ${date}\n` +
      `• Requirements: ${notes || "None"}`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col justify-between">
      <Nav />

      {/* Header */}
      <section className="relative pt-36 pb-16 px-6 border-b border-border overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-grid pointer-events-none z-0" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="text-yellow text-xs tracking-[0.5em] uppercase mb-3 font-semibold">— Service Station —</div>
          <h1 className="font-display font-black text-4xl md:text-6xl">
            Book Your <span className="text-yellow text-glow">Service</span>
          </h1>
          <p className="mt-4 text-foreground/85 max-w-lg mx-auto text-sm md:text-base leading-relaxed font-body">
            Fill in the details below to schedule your custom build, upgrade, or service. Let's make your machine rise above.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto relative">
          <div className="absolute -inset-4 bg-yellow/5 blur-3xl rounded-full pointer-events-none" />
          
          <motion.div 
            className="card-dark p-8 md:p-10 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Name</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sagar Shetty"
                      className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/45 transition-all duration-300 font-body"
                    />
                  </div>
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 7892318639"
                      className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/45 transition-all duration-300 font-body"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bike Brand */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Bike Brand</label>
                    <input
                      required
                      type="text"
                      value={bikeBrand}
                      onChange={(e) => setBikeBrand(e.target.value)}
                      placeholder="e.g. Royal Enfield"
                      className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/45 transition-all duration-300 font-body"
                    />
                  </div>
                  {/* Bike Model */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Bike Model</label>
                    <input
                      required
                      type="text"
                      value={bikeModel}
                      onChange={(e) => setBikeModel(e.target.value)}
                      placeholder="e.g. Himalayan 450"
                      className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/45 transition-all duration-300 font-body"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Service Requirement</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground transition-all duration-300 cursor-pointer font-body"
                  >
                    {SERVICE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-card text-foreground">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Preferred Appointment Date</label>
                  <input
                    required
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground transition-all duration-300 cursor-pointer font-body"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-foreground/60 font-semibold">Describe modifications or servicing requirements</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe custom paint, performance tuning, specific fairings or details you want modified..."
                    className="w-full bg-background border border-border focus:border-yellow outline-none px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/45 transition-all duration-300 resize-none font-body"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-yellow justify-center py-3.5 text-sm cursor-pointer shadow-lg hover:shadow-yellow-sm"
                >
                  Schedule Appointment
                </button>
              </form>
            ) : (
              <motion.div 
                className="text-center py-8 space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 bg-yellow/15 border border-yellow text-yellow rounded-full flex items-center justify-center text-3xl mx-auto shadow-md">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl uppercase tracking-wider text-foreground">Booking Initialized</h3>
                  <p className="text-sm text-foreground/75 max-w-sm mx-auto leading-relaxed font-body">
                    Your service details are ready. Tap below to send them to the Zero Gravity crew on WhatsApp and confirm your slot!
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-yellow justify-center py-3 cursor-pointer shadow-md text-center"
                  >
                    Send on WhatsApp
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="flex-1 btn-ghost-yellow justify-center py-3 cursor-pointer"
                  >
                    Edit Details
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
