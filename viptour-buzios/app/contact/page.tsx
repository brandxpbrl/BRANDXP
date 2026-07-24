"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";
import { Send, CheckCircle, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "Brand Experience",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    // Simulate server request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello Master Solutions! I'd like to get in touch.
Name: ${form.name}
Email: ${form.email}
Interest: ${form.service}
Message: ${form.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5545999686381?text=${encodedText}`, "_blank");
  };

  return (
    <PortalPage
      eyebrow="Contact Hub"
      title="Start your evolution"
      description="Connect with Master Solutions. Reach out via email, social networks, or submit your project guidelines below."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
        
        {/* Form Container */}
        <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-sky-500/5 to-transparent pointer-events-none" />
          
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-6">Project Request Form</p>
          
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-400 animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Guidelines Received Successfully</h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Thank you for contacting Master Solutions. Our strategy experts will review your request and get back to you shortly.
                </p>
              </div>
              <button
                onClick={handleWhatsAppRedirect}
                className="cta interactive inline-flex items-center gap-2 px-6 py-3 bg-[#D6A24A] hover:bg-[#c3913e] text-black text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300"
                style={{ background: 'linear-gradient(180deg, #F5D08C 0%, #D6A24A 100%)' }}
              >
                <MessageSquare className="w-4 h-4" />
                Send via WhatsApp Immediately
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Service of Interest
                </label>
                <select
                  id="service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full rounded-2xl bg-[#09090d] border border-white/10 px-4 py-4 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                >
                  <option value="Brand Experience">Brand Experience (Creative & Digital)</option>
                  <option value="MPE Lab">MPE Lab (Resonant & Visual Geometry)</option>
                  <option value="QUBIT Engine">QUBIT Engine (Tech & Data Architecture)</option>
                  <option value="Fragma Studio">Fragma Studio (Tailor-made Branding)</option>
                  <option value="VIPTOUR Búzios">VIPTOUR Búzios Integration</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Project Brief or Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your goals, timeline, and how we can elevate your business..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full cta interactive inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-400 to-sky-600 hover:opacity-95 text-black text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Transmitting..." : "Submit Project Guidelines"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Channels Information */}
        <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-8 backdrop-blur-md space-y-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-6">Direct Channels</p>
            <div className="space-y-4 text-sm font-semibold text-white">
              <Link href={portalConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/5 bg-white/5 px-5 py-5 transition-all hover:bg-white/10 hover:border-white/10">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Official Instagram</span>
                @brandexperience.br
              </Link>
              <Link href={portalConfig.links.instagramPersonal} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/5 bg-white/5 px-5 py-5 transition-all hover:bg-white/10 hover:border-white/10">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Creative Director</span>
                @fela_cto
              </Link>
              <Link href={portalConfig.links.instagramTours} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/5 bg-white/5 px-5 py-5 transition-all hover:bg-white/10 hover:border-white/10">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Ecosystem Partner</span>
                @fela.tours
              </Link>
              <Link href={portalConfig.links.instagramMpe} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/5 bg-white/5 px-5 py-5 transition-all hover:bg-white/10 hover:border-white/10">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">MPE Engine</span>
                @mpe_engine
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Corporate Headquarters</span>
            <p className="text-sm font-bold text-white">{portalConfig.contacts.location}</p>
            <p className="text-xs text-gray-400 mt-1">Available for worldwide strategic partnerships.</p>
          </div>
        </div>

      </div>
    </PortalPage>
  );
}
