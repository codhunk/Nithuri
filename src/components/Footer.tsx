"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full transition-colors duration-300">
      {/* CTA Section */}
      <section className="bg-[#054c44] py-20 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Ready to Take the Next Step?</h2>
          <p className="text-slate-200/80 text-base md:text-lg font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're looking to invest, buy, or list your property, our team is ready to assist you with professional excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/add-property"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#054c44] font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10 text-base"
            >
              List Your Property Today
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-base"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="bg-[#0a1614] py-10 px-6 md:px-20 text-white/70">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 pb-20">

          {/* Brand & Social */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Link href="/">
                <img src="/logo.jpeg" alt="Logo" className="w-40 h-20 rounded-xl" />
              </Link>
            </div>
            <p className="text-sm leading-relaxed max-w-xs font-medium">
              Leading the way in premium land development and comprehensive business consultancy services for over three decades.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "public", label: "Website" },
                { icon: "alternate_email", label: "Email" },
                { icon: "call", label: "Call" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#054c44] transition-all group"
                >
                  <span className="material-symbols-outlined text-sm text-white/50 group-hover:text-white">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/properties" className="hover:text-primary transition-colors">Property Listings</Link></li>
              <li><Link href="/invest" className="hover:text-primary transition-colors">Investment Plans</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Legal Consultancy</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Business Strategy</Link></li>
              <li><Link href="/tourism" className="hover:text-primary transition-colors">Eco-Tourism Projects</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Legal &amp; Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/complaints" className="hover:text-primary transition-colors">Complaints</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Contact Info</h4>
            <ul className="space-y-6 text-sm font-medium">
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-[#054c44] text-xl">location_on</span>
                <span className="leading-relaxed">Tetari Bazar, Near Bus Stand, <br /> Siddharthnagar, UP 272202</span>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-[#054c44] text-xl">call</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-[#054c44] text-xl">mail</span>
                <span>info@nithurisingh.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="max-w-[1400px] mx-auto border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
            © 2024 Nithuri Singh &amp; Sons Associates. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">language</span>
            English (US)
          </div>
        </div>
      </section>
    </footer>
  );
}
