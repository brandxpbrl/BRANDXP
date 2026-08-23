"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalPage } from "../_components/PortalPage";
import { portalConfig } from "@/config/portal";
import { Send, CheckCircle, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form,setForm]=useState({name:"",email:"",service:"Brand Experience",message:""});
  const [isSubmitted,setIsSubmitted]=useState(false); const [isLoading,setIsLoading]=useState(false);
  const handleSubmit=(e:React.FormEvent)=>{e.preventDefault();if(!form.name||!form.email||!form.message){alert("Please fill in all required fields.");return;}setIsLoading(true);setTimeout(()=>{setIsLoading(false);setIsSubmitted(true)},1000)};
  const handleWhatsAppRedirect=()=>{const text=`Hello ${portalConfig.name}! I'd like to get in touch.\nName: ${form.name}\nEmail: ${form.email}\nInterest: ${form.service}\nMessage: ${form.message}`;window.open(`https://wa.me/5545999686381?text=${encodeURIComponent(text)}`,"_blank")};
  return <PortalPage eyebrow="ORBIS · Contact" title="Connect with the ecosystem" description={`Connect with ${portalConfig.name}. Tell us what you want to build, explore or transform and we will route your request to the right world.`}>
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
      <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-8 backdrop-blur-md"><p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-6">Project Request</p>
      {isSubmitted?<div className="flex flex-col items-center justify-center py-12 text-center space-y-6"><CheckCircle className="w-16 h-16 text-green-400"/><div><h3 className="text-2xl font-bold">Request received</h3><p className="mt-2 text-sm text-gray-400">Thank you for contacting {portalConfig.name}. We will review your request and connect it with the right part of the ecosystem.</p></div><button onClick={handleWhatsAppRedirect} className="inline-flex items-center gap-2 px-6 py-3 bg-[#D6A24A] text-black text-xs font-bold uppercase tracking-wider rounded-full"><MessageSquare className="w-4 h-4"/>Send via WhatsApp</button></div>:<form onSubmit={handleSubmit} className="space-y-6">
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-white"/>
        <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-white"/>
        <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})} className="w-full rounded-2xl bg-[#09090d] border border-white/10 px-4 py-4 text-sm text-white"><option>Brand Experience</option><option>MPE Lab</option><option>QUBIT Engine</option><option>Fragma Studio</option><option>VIPTOUR Búzios</option><option>Other ORBIS world</option></select>
        <textarea required rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us what you want to create..." className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-white resize-none"/>
        <button type="submit" disabled={isLoading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-400 to-sky-600 text-black text-xs font-bold uppercase tracking-widest rounded-full disabled:opacity-50">{isLoading?"Transmitting...":"Send request"}<Send className="w-4 h-4"/></button>
      </form>}</div>
      <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-8 backdrop-blur-md"><p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-6">ORBIS Channels</p><div className="space-y-4 text-sm font-semibold"><Link href={portalConfig.links.instagram} target="_blank" className="block rounded-2xl border border-white/5 bg-white/5 px-5 py-5">Instagram · @brandexperience.br</Link><Link href={portalConfig.links.instagramPersonal} target="_blank" className="block rounded-2xl border border-white/5 bg-white/5 px-5 py-5">Creative Director · @fela_cto</Link></div><div className="mt-8 pt-6 border-t border-white/5"><span className="text-[10px] text-gray-500 uppercase tracking-widest">Location</span><p className="mt-2 text-sm font-bold">{portalConfig.contacts.location}</p></div></div>
    </div>
  </PortalPage>;
}
