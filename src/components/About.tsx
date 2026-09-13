"use client";

import { motion } from "framer-motion";
import { Target, Eye, Award } from "lucide-react";

export default function About() {
  const values = [
    { icon: <Target className="w-6 h-6" />, title: "Our Mission", desc: "To make land investment transparent, accessible, and profitable for every Indian." },
    { icon: <Eye className="w-6 h-6" />, title: "Our Vision", desc: "To be India's most trusted name in land advisory and investment." },
    { icon: <Award className="w-6 h-6" />, title: "Our Promise", desc: "Every plot we sell is verified, legally clear, and positioned for growth." },
  ];

  return (
    <section id="about" className="py-20 sm:py-24 bg-cream dark:bg-navy transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm tracking-widest uppercase mb-4">
              <span className="w-8 h-0.5 bg-gold" />
              About Terra Vista
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-6">
              A Decade of <span className="text-gold">Trusted Growth</span>
            </h2>
            <p className="text-earth-500 dark:text-white/50 leading-relaxed mb-6">
              Founded by Vikram Mehta in 2010, Terra Vista has helped over 200 families and investors secure premium land assets across India&apos;s fastest-growing regions.
            </p>
            <p className="text-earth-500 dark:text-white/50 leading-relaxed mb-8">
              We don&apos;t just sell land — we build lasting relationships through transparency, verified titles, and market expertise.
            </p>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center shrink-0">
                <span className="font-serif text-2xl font-bold text-navy">VM</span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-navy dark:text-white">Vikram Mehta</h4>
                <p className="text-earth-400 dark:text-white/40 text-sm">Founder &amp; Lead Advisor</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
            className="space-y-6"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-soft border border-earth-100 dark:border-white/5 flex items-start gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy dark:text-white mb-1">{v.title}</h3>
                  <p className="text-earth-500 dark:text-white/50 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
