"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const faq = [
  { q: "How do I list my property?", a: "To list your property, log in to your dashboard and navigate to 'Add Property'. Complete the property form and submit for review." },
  { q: "What documents are required for land purchase?", a: "Typically, you'll need a valid ID, proof of address, and proof of funds. For specific plots, additional local legal documents may be required." },
  { q: "How can I contact an investment advisor?", a: "Navigate to the 'Contact' page or click 'Contact Our Experts' in the footer to schedule a consultation." },
  { q: "Are the property prices negotiable?", a: "Some property prices are negotiable, while others are fixed. This is indicated on the property detail page or discussed during the inquiry." },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-black mb-6 underline decoration-primary decoration-4 underline-offset-8">Help Center</h1>
           <p className="text-slate-500 font-medium text-lg">Find answers to common questions or reach out to our professional support team.</p>
        </div>

        <div className="space-y-4">
           {faq.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all"
              >
                 <button 
                   onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                   className="w-full p-6 text-left flex justify-between items-center group"
                 >
                    <span className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors">{item.q}</span>
                    <span className={`material-symbols-outlined text-primary transition-transform ${openIdx === idx ? "rotate-180" : ""}`}>expand_more</span>
                 </button>
                 {openIdx === idx && (
                    <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                       {item.a}
                    </div>
                 )}
              </div>
           ))}
        </div>

        <div className="mt-20 p-8 bg-primary rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20">
           <div>
              <h3 className="text-2xl font-black mb-2">Still Need Assistance?</h3>
              <p className="text-white/70 font-medium">Our real estate experts are available 24/7 to guide you through your journey.</p>
           </div>
           <a href="/contact" className="px-8 py-4 bg-white text-primary font-black rounded-xl hover:bg-slate-50 transition-all shadow-lg min-w-[200px] text-center">
              Message Support
           </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
