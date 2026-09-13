"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, MapPin, Star } from "lucide-react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { number: "500+", label: "Acres Sold", icon: <MapPin className="w-5 h-5" /> },
    { number: "200+", label: "Happy Clients", icon: <Star className="w-5 h-5" /> },
    { number: "15+", label: "Years Experience", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop"
          alt="Fertile farmland"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50 dark:from-navy/95 dark:via-navy/80 dark:to-navy/60" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm border border-gold/20 rounded-full px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-gold text-sm font-semibold tracking-wider uppercase">Premium Land Advisory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Invest in Land, <br />
            <span className="text-gold">Build Your Legacy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
            className="text-white/70 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
          >
            India&apos;s trusted land advisory since 2010. We connect you with verified, appreciating land assets across growth corridors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              className="bg-gold text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-glow transition-all hover:-translate-y-1 hover:shadow-glow inline-flex items-center justify-center gap-2 group"
            >
              Buy Land
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-500 hover:text-white transition-all inline-flex items-center justify-center gap-2 group"
            >
              Sell Land
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-lg"
        >
          {stats.map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="text-gold mb-2">{s.icon}</div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">{s.number}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
