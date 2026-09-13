"use client";

import { motion } from "framer-motion";
import { Search, FileCheck, Handshake, TrendingUp, MapPin, Shield } from "lucide-react";

const services = [
  { icon: <Search className="w-6 h-6" />, title: "Land Discovery", desc: "Curated selection of verified properties matching your investment goals." },
  { icon: <FileCheck className="w-6 h-6" />, title: "Legal Verification", desc: "Complete title scrutiny, encumbrance checks, and compliance audit." },
  { icon: <Handshake className="w-6 h-6" />, title: "Negotiation", desc: "Expert negotiation to secure the best price for your chosen land." },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Growth Analysis", desc: "Data-driven insights on appreciation potential and market trends." },
  { icon: <MapPin className="w-6 h-6" />, title: "Site Visits", desc: "Guided tours with local experts to experience properties firsthand." },
  { icon: <Shield className="w-6 h-6" />, title: "Post-Sale Support", desc: "Ongoing assistance with registration, fencing, and development." },
];

const process = [
  { step: "01", title: "Consultation", desc: "Share your goals, budget, and preferred locations." },
  { step: "02", title: "Discovery", desc: "We shortlist verified properties matching your criteria." },
  { step: "03", title: "Site Visit", desc: "Experience the land firsthand with our expert guides." },
  { step: "04", title: "Closure", desc: "Legal verification, negotiation, and seamless registration." },
];

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-white dark:bg-earth-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm tracking-widest uppercase mb-4">
            <span className="w-8 h-0.5 bg-gold" />
            What We Offer
            <span className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white">
            End-to-End <span className="text-gold">Land Services</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-cream dark:bg-navy-light rounded-2xl p-6 border border-earth-100 dark:border-white/5 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-navy transition-colors">
                {s.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-navy dark:text-white mb-2">{s.title}</h3>
              <p className="text-earth-500 dark:text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy dark:text-white">
            How It <span className="text-gold">Works</span>
          </h3>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gold/20" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-24 h-24 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="font-serif text-3xl font-bold text-navy">{p.step}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-navy dark:text-white mb-2">{p.title}</h4>
                <p className="text-earth-500 dark:text-white/50 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
