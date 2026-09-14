"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle, ArrowRight, X, Play, Video } from "lucide-react";
import { useState, useEffect } from "react";

interface Property {
  id: number; name: string; type: string; location: string; size: string;
  price: string; status: string; feat1: string; feat2: string; feat3: string;
  image: string; description: string; video_url: string;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 20 } },
};

function getYouTubeEmbed(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbed(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    fetch("/api/properties")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setProperties(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const getEmbedUrl = (url: string) => {
    return getYouTubeEmbed(url) || getVimeoEmbed(url);
  };

  return (
    <section id="properties" className="py-20 sm:py-24 bg-cream dark:bg-navy transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm tracking-widest uppercase mb-4">
            <span className="w-8 h-0.5 bg-gold" />
            Our Properties
            <span className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white">
            Featured <span className="text-gold">Properties</span>
          </h2>
          <p className="text-earth-500 dark:text-white/50 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Handpicked premium properties in India&apos;s growth corridors. Verified, transparently priced, ready for you.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white dark:bg-navy-light rounded-2xl overflow-hidden border border-earth-100 dark:border-white/5 animate-pulse">
                <div className="h-64 bg-earth-200 dark:bg-white/5" />
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-earth-200 dark:bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-earth-200 dark:bg-white/5 rounded w-1/2" />
                  <div className="h-8 bg-earth-200 dark:bg-white/5 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-earth-400 dark:text-white/40 text-lg">Unable to load properties. Please try again later.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-earth-400 dark:text-white/40 text-lg">No properties available yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {properties.map((p) => {
              const features = [p.feat1, p.feat2, p.feat3].filter(Boolean);
              const priceParts = p.price.split(" / ");
              return (
                <motion.article
                  key={p.id}
                  variants={card}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  className="bg-white dark:bg-navy-light rounded-2xl overflow-hidden shadow-soft hover:shadow-2xl transition-shadow group border border-earth-100 dark:border-white/5"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-gold text-navy px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide">
                      {p.type}
                    </span>
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {p.status}
                    </div>
                    {p.video_url && (
                      <div className="absolute bottom-4 right-4 bg-navy/80 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                        <Video className="w-3.5 h-3.5" />
                        Video Tour
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-navy dark:text-white mb-2">{p.name}</h3>
                    <div className="flex items-center gap-1.5 text-earth-400 dark:text-white/40 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-gold" />
                      {p.location}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {features.map((f) => (
                        <span key={f} className="text-xs bg-cream dark:bg-white/5 text-earth-600 dark:text-white/60 px-3 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-gold" />
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="border-t border-earth-100 dark:border-white/5 pt-4 flex items-center justify-between">
                      <div>
                        <span className="font-serif text-xl sm:text-2xl font-bold text-navy dark:text-white">{priceParts[0]}</span>
                        {priceParts[1] && <span className="text-earth-400 dark:text-white/40 text-sm ml-1">/ {priceParts[1].replace("/", "").trim()}</span>}
                      </div>
                      <button
                        onClick={() => setSelected(p)}
                        className="bg-navy dark:bg-gold text-gold dark:text-navy px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold hover:text-navy dark:hover:bg-gold-glow transition-all inline-flex items-center gap-1 group/btn"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-navy-light rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-gold text-navy px-3 py-1 rounded-lg text-xs font-bold uppercase">{selected.type}</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">{selected.name}</h2>
                  <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                    <MapPin className="w-4 h-4 text-gold" />
                    {selected.location}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Price and Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="font-serif text-3xl font-bold text-navy dark:text-white">{selected.price.split(" / ")[0]}</span>
                    {selected.price.split(" / ")[1] && (
                      <span className="text-earth-400 dark:text-white/40 text-sm ml-1">/ {selected.price.split(" / ")[1].replace("/", "").trim()}</span>
                    )}
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${selected.status === "Available" ? "bg-primary-500/10 text-primary-500" : "bg-red-500/10 text-red-500"}`}>
                    {selected.status}
                  </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[selected.feat1, selected.feat2, selected.feat3].filter(Boolean).map((f) => (
                    <span key={f} className="bg-cream dark:bg-white/5 text-earth-600 dark:text-white/60 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gold" />
                      {f}
                    </span>
                  ))}
                </div>

                {/* Size */}
                <div className="bg-cream dark:bg-white/5 rounded-xl p-4 mb-6">
                  <p className="text-earth-400 dark:text-white/40 text-sm">Plot Size</p>
                  <p className="font-serif text-xl font-bold text-navy dark:text-white">{selected.size}</p>
                </div>

                {/* Description */}
                {selected.description && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg font-bold text-navy dark:text-white mb-2">About This Property</h3>
                    <p className="text-earth-500 dark:text-white/50 leading-relaxed">{selected.description}</p>
                  </div>
                )}

                {/* Video Section */}
                {selected.video_url && (
                  <div className="mb-6">
                    <h3 className="font-serif text-lg font-bold text-navy dark:text-white mb-3 flex items-center gap-2">
                      <Play className="w-5 h-5 text-gold" />
                      Property Video Tour
                    </h3>
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-navy">
                      <iframe
                        src={getEmbedUrl(selected.video_url) || selected.video_url}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${selected.name} video tour`}
                      />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <a
                  href="#contact"
                  onClick={() => setSelected(null)}
                  className="w-full bg-gold text-navy py-4 rounded-xl font-bold text-lg hover:bg-gold-glow transition-all inline-flex items-center justify-center gap-2"
                >
                  Contact Us About This Property
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}