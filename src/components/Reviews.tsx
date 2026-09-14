"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, FormEvent } from "react";
import { Star, Send, Loader2, CheckCircle, Quote } from "lucide-react";

interface Review {
  id: number; name: string; rating: number; text: string; date: string; type: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: 5, text: "", type: "buyer" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(d => { setReviews(d); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) { setError(true); return; }
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      const fresh = await fetch("/api/reviews").then(r => r.json());
      setReviews(fresh);
      setSubmitted(true);
      setFormData({ name: "", rating: 5, text: "", type: "buyer" });
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= count ? "text-gold fill-gold" : "text-earth-300 dark:text-white/20"}`} />
      ))}
    </div>
  );

  return (
    <section id="reviews" className="py-20 sm:py-24 bg-cream dark:bg-navy transition-colors">
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
            Testimonials
            <span className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white">
            What Our <span className="text-gold">Clients Say</span>
          </h2>
          <p className="text-earth-500 dark:text-white/50 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Hear from families and investors who trusted us with their land journey.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-navy-light rounded-2xl p-6 border border-earth-100 dark:border-white/5 animate-pulse">
                <div className="h-4 bg-earth-200 dark:bg-white/5 rounded w-1/3 mb-4" />
                <div className="h-3 bg-earth-200 dark:bg-white/5 rounded w-full mb-2" />
                <div className="h-3 bg-earth-200 dark:bg-white/5 rounded w-4/5 mb-4" />
                <div className="h-4 bg-earth-200 dark:bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {reviews.slice(0, 4).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-navy-light rounded-2xl p-6 border border-earth-100 dark:border-white/5 hover:shadow-lg transition-shadow relative"
              >
                <Quote className="w-8 h-8 text-gold/20 absolute top-4 right-4" />
                {renderStars(r.rating)}
                <p className="text-earth-600 dark:text-white/60 text-sm mt-4 mb-6 leading-relaxed line-clamp-4">{r.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-sm">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy dark:text-white text-sm">{r.name}</h4>
                    <p className="text-earth-400 dark:text-white/40 text-xs capitalize">{r.type}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(true)}
                className="bg-navy dark:bg-gold text-gold dark:text-navy px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold hover:text-navy dark:hover:bg-gold-glow transition-all inline-flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Write a Review
              </motion.button>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg mx-auto"
              >
                {submitted ? (
                  <div className="bg-white dark:bg-navy-light rounded-2xl p-8 border border-gold/30 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-navy" />
                    </motion.div>
                    <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">Thank You!</h3>
                    <p className="text-earth-500 dark:text-white/50 text-sm mb-6">Your review has been submitted successfully.</p>
                    <button onClick={() => { setSubmitted(false); setShowForm(false); }} className="bg-navy dark:bg-gold text-gold dark:text-navy px-6 py-2.5 rounded-xl font-semibold hover:bg-gold hover:text-navy dark:hover:bg-gold-glow transition-all">
                      Back to Reviews
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-light rounded-2xl p-8 border border-earth-100 dark:border-white/5 text-left">
                    <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-6 text-center">Share Your Experience</h3>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white placeholder:text-earth-400 focus:outline-none focus:border-gold transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">I am a *</label>
                        <select
                          value={formData.type}
                          onChange={e => setFormData({ ...formData, type: e.target.value })}
                          className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors appearance-none"
                        >
                          <option value="buyer" className="bg-white dark:bg-navy">Buyer</option>
                          <option value="seller" className="bg-white dark:bg-navy">Seller</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: i })}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star className={`w-8 h-8 ${i <= formData.rating ? "text-gold fill-gold" : "text-earth-300 dark:text-white/20"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Your Review *</label>
                      <textarea
                        value={formData.text}
                        onChange={e => setFormData({ ...formData, text: e.target.value })}
                        rows={4}
                        placeholder="Tell us about your experience with Terra Vista..."
                        className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white placeholder:text-earth-400 focus:outline-none focus:border-gold transition-colors resize-none"
                        required
                      />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4" role="alert">Please fill in all required fields.</p>}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-gold text-navy py-3.5 rounded-xl font-bold hover:bg-gold-glow transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      >
                        {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Review</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setError(false); }}
                        className="bg-earth-100 dark:bg-white/5 text-earth-600 dark:text-white/60 px-6 py-3.5 rounded-xl font-semibold hover:bg-earth-200 dark:hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}