"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2, Home, MapPinned } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [clientType, setClientType] = useState<"buyer" | "seller">("buyer");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", interest: "", message: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          interest: clientType === "seller" ? "Selling Land" : formData.interest,
          message: formData.message,
          date: new Date().toISOString().split("T")[0],
          status: "New",
          type: clientType,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <MapPin className="w-5 h-5" />, label: "Office", value: "MG Road, Bangalore, India" },
    { icon: <Phone className="w-5 h-5" />, label: "Call", value: "+91 98765 43210" },
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: "vikram@terravista.in" },
    { icon: <Clock className="w-5 h-5" />, label: "Hours", value: "Mon – Sat: 9AM – 7PM" },
  ];

  return (
    <section id="contact" className="py-20 sm:py-24 bg-navy dark:bg-earth-950 relative overflow-hidden transition-colors">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm tracking-widest uppercase mb-4">
            <span className="w-8 h-0.5 bg-gold" />
            Get in Touch
            <span className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {clientType === "buyer" ? "Let's Find Your Perfect Land" : "Sell Your Land at the Best Price"}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{info.label}</h4>
                  <p className="text-white/50 text-sm">{info.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6"
                >
                  {/* Client Type Toggle */}
                  <div>
                    <label className="block text-white/60 text-sm mb-3">I am a *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setClientType("buyer")}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                          clientType === "buyer"
                            ? "bg-gold text-navy border-gold"
                            : "bg-white/5 text-white/60 border-white/10 hover:border-gold/30"
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        Buyer — Looking to Buy Land
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType("seller")}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                          clientType === "seller"
                            ? "bg-primary-500 text-white border-primary-500"
                            : "bg-white/5 text-white/60 border-white/10 hover:border-primary-500/30"
                        }`}
                      >
                        <MapPinned className="w-4 h-4" />
                        Seller — Looking to Sell Land
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Full Name *</label>
                      <input required type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Phone *</label>
                      <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Email</label>
                    <input type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors" />
                  </div>

                  {clientType === "buyer" && (
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Interested In *</label>
                      <select required value={formData.interest} onChange={e => setFormData({ ...formData, interest: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors appearance-none">
                        <option value="" className="bg-navy">Select type</option>
                        <option value="Agricultural" className="bg-navy">Agricultural Land</option>
                        <option value="Residential" className="bg-navy">Residential Plot</option>
                        <option value="Commercial" className="bg-navy">Commercial Land</option>
                        <option value="Farmhouse" className="bg-navy">Farmhouse</option>
                      </select>
                    </div>
                  )}

                  {clientType === "seller" && (
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Property Location *</label>
                      <input required type="text" placeholder="Where is your land located?" value={formData.interest} onChange={e => setFormData({ ...formData, interest: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/60 text-sm mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder={clientType === "buyer" ? "Tell us about your requirements..." : "Tell us about your land (size, price expectations, etc.)"}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gold text-navy py-4 rounded-xl font-bold text-lg hover:bg-gold-glow transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> {clientType === "buyer" ? "Submit Enquiry" : "List My Property"}</>}
                  </button>
                  {submitError && (
                    <p className="text-red-400 text-sm text-center" role="alert">Something went wrong. Please try again.</p>
                  )}
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 backdrop-blur-sm border border-gold/30 rounded-2xl p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-navy" />
                  </motion.div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">Thank You!</h3>
                  <p className="text-white/60 mb-8">
                    {clientType === "buyer"
                      ? "Your enquiry has been received. Vikram will contact you within 24 hours."
                      : "Your property details have been received. Our team will review and contact you shortly."}
                  </p>
                  <button onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", email: "", interest: "", message: "" }); setClientType("buyer"); }} className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                    Submit Another Enquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
