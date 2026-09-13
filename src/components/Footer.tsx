"use client";

import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-earth-950 text-white/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-navy" />
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Terra<span className="text-gold">Vista</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              India&apos;s trusted land advisory. Helping families and investors build wealth through verified land assets since 2010.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Properties", "Services", "Contact"].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-sm hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {["Land Discovery", "Legal Verification", "Growth Analysis", "Site Visits", "Post-Sale Support"].map(s => (
                <li key={s}>
                  <a href="#services" className="text-sm hover:text-gold transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gold" /> +91 98765 43210</li>
              <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gold" /> vikram@terravista.in</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2026 Terra Vista. All rights reserved.</p>
          <a href="#home" className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition-all" aria-label="Back to top">
            <ArrowUp className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
