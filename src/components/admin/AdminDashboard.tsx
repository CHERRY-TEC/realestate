"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, FormEvent } from "react";
import {
  LayoutDashboard, Home, Users, PlusCircle, LogOut, Search, Edit3, Trash2,
  X, Upload, Star, Building2, TrendingUp, UserCheck, ArrowUpRight, Loader2, MessageSquare
} from "lucide-react";

interface Property {
  id: number; name: string; type: string; location: string; size: string;
  price: string; status: string; feat1: string; feat2: string; feat3: string;
  image: string; desc: string;
}

interface Lead {
  id: number; name: string; phone: string; email: string; interest: string;
  message: string; date: string; status: string; type: string;
}

interface Review {
  id: number; name: string; rating: number; text: string; date: string; type: string;
}

const emptyProp: Property = { id: 0, name: "", type: "Agricultural", location: "", size: "", price: "", status: "Available", feat1: "", feat2: "", feat3: "", image: "", desc: "" };

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "properties", label: "Properties", icon: <Home className="w-5 h-5" /> },
  { id: "leads", label: "Leads", icon: <Users className="w-5 h-5" /> },
  { id: "reviews", label: "Reviews", icon: <MessageSquare className="w-5 h-5" /> },
];

interface Props { onLogout: () => void; }

export default function AdminDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const [form, setForm] = useState<Property>(emptyProp);
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLeadId, setDeleteLeadId] = useState<number | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/properties").then(r => r.json()).then(setProperties).catch(() => {});
    fetch("/api/leads").then(r => r.json()).then(setLeads).catch(() => {});
    fetch("/api/reviews").then(r => r.json()).then(setReviews).catch(() => {});
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleSaveProp = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.size || !form.price) { showToast("Please fill required fields"); return; }
    setSaving(true);
    try {
      if (editProp) {
        const res = await fetch("/api/properties", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editProp.id }) });
        if (!res.ok) throw new Error();
        showToast("Property updated");
      } else {
        const res = await fetch("/api/properties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error();
        showToast("Property added — " + form.name);
      }
      const fresh = await fetch("/api/properties").then(r => r.json());
      setProperties(fresh);
      setShowForm(false);
      setEditProp(null);
      setForm(emptyProp);
      setActiveTab("properties");
    } catch {
      showToast("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProp = async () => {
    if (deleteId === null) return;
    try {
      const res = await fetch("/api/properties", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteId }) });
      if (!res.ok) throw new Error();
      const fresh = await fetch("/api/properties").then(r => r.json());
      setProperties(fresh);
      setDeleteId(null);
      showToast("Property deleted");
    } catch {
      showToast("Failed to delete property");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, image: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const cycleLeadStatus = async (id: number) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const next = lead.status === "New" ? "Contacted" : lead.status === "Contacted" ? "Closed" : "New";
    try {
      const res = await fetch("/api/leads", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, status: next }) });
      if (!res.ok) throw new Error();
      const fresh = await fetch("/api/leads").then(r => r.json());
      setLeads(fresh);
      showToast("Status updated");
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleDeleteLead = async () => {
    if (deleteLeadId === null) return;
    try {
      const res = await fetch("/api/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteLeadId }) });
      if (!res.ok) throw new Error();
      const fresh = await fetch("/api/leads").then(r => r.json());
      setLeads(fresh);
      setDeleteLeadId(null);
      showToast("Enquiry deleted");
    } catch {
      showToast("Failed to delete enquiry");
    }
  };

  const handleDeleteReview = async () => {
    if (deleteReviewId === null) return;
    try {
      const res = await fetch("/api/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteReviewId }) });
      if (!res.ok) throw new Error();
      const fresh = await fetch("/api/reviews").then(r => r.json());
      setReviews(fresh);
      setDeleteReviewId(null);
      showToast("Review deleted");
    } catch {
      showToast("Failed to delete review");
    }
  };

  const filteredProps = properties.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase()));
  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search));
  const filteredReviews = reviews.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  const buyerCount = leads.filter(l => l.type === "buyer").length;
  const sellerCount = leads.filter(l => l.type === "seller").length;

  return (
    <div className="min-h-screen bg-cream dark:bg-navy flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-navy dark:bg-earth-950 flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-navy" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white">Terra<span className="text-gold">Vista</span></span>
              <p className="text-white/30 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); setSearch(""); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gold/10 text-gold"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => { setForm(emptyProp); setEditProp(null); setShowForm(true); setActiveTab("properties"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-gold hover:bg-gold/5 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Add Property
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy dark:text-white capitalize">{activeTab}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-navy-light border border-earth-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-navy dark:text-white placeholder:text-earth-400 focus:outline-none focus:border-gold w-64"
              />
            </div>
          </div>
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                { label: "Total Properties", value: properties.length, icon: <Home className="w-5 h-5" />, color: "bg-gold/10 text-gold" },
                { label: "Available", value: properties.filter(p => p.status === "Available").length, icon: <TrendingUp className="w-5 h-5" />, color: "bg-primary-500/10 text-primary-500" },
                { label: "Buyers", value: buyerCount, icon: <UserCheck className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-500" },
                { label: "Sellers", value: sellerCount, icon: <Users className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-navy-light rounded-2xl p-6 border border-earth-100 dark:border-white/5">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>{stat.icon}</div>
                  <p className="text-earth-400 dark:text-white/40 text-sm">{stat.label}</p>
                  <p className="font-serif text-3xl font-bold text-navy dark:text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-navy-light rounded-2xl border border-earth-100 dark:border-white/5 overflow-hidden">
              <div className="p-6 border-b border-earth-100 dark:border-white/5">
                <h3 className="font-serif text-lg font-bold text-navy dark:text-white">Recent Leads</h3>
              </div>
              <div className="divide-y divide-earth-100 dark:divide-white/5">
                {leads.slice(-5).reverse().map(l => (
                  <div key={l.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy dark:bg-gold rounded-full flex items-center justify-center text-gold dark:text-navy font-bold text-sm">{l.name.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-navy dark:text-white text-sm">{l.name}</p>
                        <p className="text-earth-400 dark:text-white/40 text-xs">{l.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${l.type === "seller" ? "bg-primary-500/10 text-primary-500" : "bg-gold/10 text-gold"}`}>
                        {l.type === "seller" ? "Seller" : "Buyer"}
                      </span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${l.status === "New" ? "bg-yellow-500/10 text-yellow-600" : l.status === "Contacted" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-600"}`}>
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Properties */}
        {activeTab === "properties" && !showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="bg-white dark:bg-navy-light rounded-2xl border border-earth-100 dark:border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-earth-100 dark:border-white/5">
                      {["Name", "Location", "Size", "Price", "Type", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-earth-400 dark:text-white/40 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-100 dark:divide-white/5">
                    {filteredProps.map(p => (
                      <tr key={p.id} className="hover:bg-cream dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.image && <img src={p.image} alt="" className="w-10 h-8 rounded-lg object-cover" />}
                            <span className="font-semibold text-navy dark:text-white text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{p.location}</td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{p.size}</td>
                        <td className="px-6 py-4 font-semibold text-navy dark:text-white text-sm">{p.price}</td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{p.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${p.status === "Available" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>{p.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditProp(p); setForm(p); setShowForm(true); }} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-colors" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add/Edit Form */}
        {activeTab === "properties" && showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="bg-white dark:bg-navy-light rounded-2xl border border-earth-100 dark:border-white/5 p-6 sm:p-8 max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-navy dark:text-white">{editProp ? "Edit Property" : "Add New Property"}</h3>
                <button onClick={() => { setShowForm(false); setEditProp(null); setForm(emptyProp); }} className="text-earth-400 hover:text-navy dark:hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveProp} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Property Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Green Valley Farm" />
                  </div>
                  <div>
                    <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Type *</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors appearance-none">
                      {["Agricultural", "Residential", "Commercial", "Farmhouse", "Layout"].map(t => <option key={t} value={t} className="bg-white dark:bg-navy">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Location *</label>
                    <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Nashik, Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Size *</label>
                    <input type="text" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 5 Acres" />
                  </div>
                  <div>
                    <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Price *</label>
                    <input type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. ₹12.5L / acre" />
                  </div>
                  <div>
                    <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors appearance-none">
                      {["Available", "Sold", "Pending"].map(s => <option key={s} value={s} className="bg-white dark:bg-navy">{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Property Photo</label>
                  <div className="border-2 border-dashed border-earth-200 dark:border-white/10 rounded-xl p-6 text-center hover:border-gold transition-colors cursor-pointer relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Upload property photo" />
                    {form.image ? (
                      <div className="relative inline-block">
                        <img src={form.image} alt="Preview" className="max-h-40 rounded-lg mx-auto" />
                        <button type="button" onClick={() => setForm({ ...form, image: "" })} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <><Upload className="w-8 h-8 text-earth-300 mx-auto mb-2" /><p className="text-earth-400 text-sm">Click to upload land photo</p><p className="text-earth-300 text-xs mt-1">JPG, PNG up to 5MB</p></>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div><label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Feature 1</label><input type="text" value={form.feat1} onChange={e => setForm({ ...form, feat1: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Irrigated" /></div>
                  <div><label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Feature 2</label><input type="text" value={form.feat2} onChange={e => setForm({ ...form, feat2: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Road Access" /></div>
                  <div><label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Feature 3</label><input type="text" value={form.feat3} onChange={e => setForm({ ...form, feat3: e.target.value })} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Water Supply" /></div>
                </div>
                <div>
                  <label className="block text-earth-600 dark:text-white/60 text-sm mb-2 font-medium">Description</label>
                  <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full bg-cream dark:bg-white/5 border border-earth-200 dark:border-white/10 rounded-xl px-4 py-3 text-navy dark:text-white focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Brief description..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-gold-glow transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2">{saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : editProp ? "Update Property" : "Save Property"}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditProp(null); setForm(emptyProp); }} className="bg-earth-100 dark:bg-white/5 text-earth-600 dark:text-white/60 px-6 py-3 rounded-xl font-semibold hover:bg-earth-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Leads */}
        {activeTab === "leads" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="bg-white dark:bg-navy-light rounded-2xl border border-earth-100 dark:border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-earth-100 dark:border-white/5">
                      {["Name", "Phone", "Type", "Interest", "Message", "Date", "Status", "Action"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-earth-400 dark:text-white/40 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-100 dark:divide-white/5">
                    {filteredLeads.map(l => (
                      <tr key={l.id} className="hover:bg-cream dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-navy dark:bg-gold rounded-full flex items-center justify-center text-gold dark:text-navy text-xs font-bold">{l.name.charAt(0)}</div><span className="font-semibold text-navy dark:text-white text-sm">{l.name}</span></div></td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{l.phone}</td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-xl text-xs font-semibold ${l.type === "seller" ? "bg-primary-500/10 text-primary-500" : "bg-gold/10 text-gold"}`}>{l.type === "seller" ? "Seller" : "Buyer"}</span></td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{l.interest}</td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm max-w-[150px] truncate">{l.message || "—"}</td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{l.date}</td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-xl text-xs font-semibold ${l.status === "New" ? "bg-yellow-500/10 text-yellow-600" : l.status === "Contacted" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-600"}`}>{l.status}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => cycleLeadStatus(l.id)} className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center hover:bg-gold/20 transition-colors" aria-label="Update status"><ArrowUpRight className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteLeadId(l.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors" aria-label="Delete enquiry"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}>
            <div className="bg-white dark:bg-navy-light rounded-2xl border border-earth-100 dark:border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-earth-100 dark:border-white/5">
                      {["Name", "Type", "Rating", "Review", "Date", "Action"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-earth-400 dark:text-white/40 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-earth-100 dark:divide-white/5">
                    {filteredReviews.map(r => (
                      <tr key={r.id} className="hover:bg-cream dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-navy dark:bg-gold rounded-full flex items-center justify-center text-gold dark:text-navy text-xs font-bold">{r.name.charAt(0)}</div><span className="font-semibold text-navy dark:text-white text-sm">{r.name}</span></div></td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-xl text-xs font-semibold ${r.type === "seller" ? "bg-primary-500/10 text-primary-500" : "bg-gold/10 text-gold"}`}>{r.type === "seller" ? "Seller" : "Buyer"}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-4 h-4 ${i <= r.rating ? "text-gold fill-gold" : "text-earth-300 dark:text-white/20"}`} />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm max-w-[200px] truncate">{r.text}</td>
                        <td className="px-6 py-4 text-earth-500 dark:text-white/50 text-sm">{r.date}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => setDeleteReviewId(r.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors" aria-label="Delete review"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Delete Property Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-navy-light rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">Delete Property?</h3>
              <p className="text-earth-500 dark:text-white/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 bg-earth-100 dark:bg-white/5 text-earth-600 dark:text-white/60 py-3 rounded-xl font-semibold hover:bg-earth-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={handleDeleteProp} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Lead Modal */}
      <AnimatePresence>
        {deleteLeadId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteLeadId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-navy-light rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">Delete Enquiry?</h3>
              <p className="text-earth-500 dark:text-white/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteLeadId(null)} className="flex-1 bg-earth-100 dark:bg-white/5 text-earth-600 dark:text-white/60 py-3 rounded-xl font-semibold hover:bg-earth-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={handleDeleteLead} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Review Modal */}
      <AnimatePresence>
        {deleteReviewId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteReviewId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-white dark:bg-navy-light rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">Delete Review?</h3>
              <p className="text-earth-500 dark:text-white/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteReviewId(null)} className="flex-1 bg-earth-100 dark:bg-white/5 text-earth-600 dark:text-white/60 py-3 rounded-xl font-semibold hover:bg-earth-200 dark:hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={handleDeleteReview} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy dark:bg-white text-white dark:text-navy px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium">
            <Star className="w-4 h-4 text-gold fill-gold" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
