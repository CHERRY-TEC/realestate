"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, MapPin } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Properties", href: "#properties" },
  { label: "Services", href: "#services" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-navy/90 backdrop-blur-xl shadow-lg border-b border-earth-100/50 dark:border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-navy" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-navy dark:text-white">
                Terra<span className="text-gold">Vista</span>
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-earth-600 dark:text-white/70 hover:text-gold dark:hover:text-gold rounded-lg hover:bg-gold/5 transition-all"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-4 bg-gold text-navy px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gold-glow transition-all hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-cream dark:bg-white/5 text-navy dark:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white dark:bg-navy-light border-t border-earth-100 dark:border-white/5"
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-earth-600 dark:text-white/70 hover:text-gold hover:bg-gold/5 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block bg-gold text-navy px-4 py-3 rounded-xl font-bold text-center mt-2"
            >
              Get Started
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
