import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function InvestPage() {
  return (
    <div className="flex h-full grow flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative py-24 px-6 md:px-20 bg-primary text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
          <div className="max-w-[1400px] mx-auto relative z-10">
            <p className="font-bold tracking-widest uppercase text-sm mb-3 text-white/70">Investor Relations</p>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Sustainable Value through<br />Disciplined Growth.
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mb-10">
              Partner with us to unlock high-yield, ethically driven investment opportunities in land banking, commercial hubs, and eco-tourism.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors">
                Download Investor Deck
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-slate-900 text-white py-10 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15%+", label: "Average Annual ROI" },
              { value: "12", label: "Active Projects" },
              { value: "₹200 Cr+", label: "Assets Under Management" },
              { value: "500+", label: "Satisfied Investors" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-primary mb-1">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Active Opportunities */}
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Portfolio</p>
              <h2 className="text-3xl md:text-4xl font-black">Active Investment Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Green Valley Land Bank",
                  type: "Agricultural Land",
                  roi: "18% p.a.",
                  min: "₹50 Lakh",
                  status: "Open",
                  desc: "Premium agricultural land consolidation across Tier-2 cities with strong appreciation potential.",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7MSs1lZXAako3P-lJhYt1psBGoOmDCc8Cy6jfQ4HqK9MPxPFQ3fBafmJTowcnQgR1OpiU_bH5jEK-7FDBMwuAuwX1rWB7ut384SlgkEDfh1LrqCm03TeCxq4wbyLF9QNdr_mEjZU3rlJaec3FJvkVZddxC00ms5GjWSiAJm5YAlvBhRd0pBxRWZua2IyTRlNjTqz9ZPqvnhGUXvlTHTcYQWhmN6mD880ChEJqZYqwBodBrMeFJ5E7JIxCnPZT-qIPV0ohCzxi8ag",
                },
                {
                  title: "Lakeside Eco Resort",
                  type: "Tourism Infrastructure",
                  roi: "14% p.a.",
                  min: "₹25 Lakh",
                  status: "Filling Fast",
                  desc: "Develop a premium eco-resort at a pristine lake destination with guaranteed lease-back.",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
                },
                {
                  title: "Commercial Hub Phase 3",
                  type: "Commercial Real Estate",
                  roi: "12% p.a.",
                  min: "₹1 Cr",
                  status: "Open",
                  desc: "Anchor investment in a mixed-use commercial development targeting tech and retail occupants.",
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWVWh301ONDY1GSlZk85eI2cwMRuWGRsbM0m4DlYyBh_NbdkWNuUXrdivaYzd7N7PAAtovrUKE11fz1V7C_Qvp_5vH0Lj_q3n7bk9cNl5qZC4QVcnM9kshMmf5DH8xWS95iuA1OoYPS4FYGGHevi1f4Vudz7CBnzB_6lIpfIgcPh53zbjMLGEPlp2pgRe_XCnDhlFqAA2RbalJUvAUjLPFOHk_X0tLtnC_r05DkBmySFakXNm2uWLUz4sWcL8gvrZlufHr7eicrG4",
                },
              ].map((opp) => (
                <div key={opp.title} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-100">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url("${opp.image}")` }} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-black text-lg">{opp.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{opp.type}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${opp.status === "Filling Fast" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                        {opp.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{opp.desc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400">Expected ROI</p>
                        <p className="text-primary font-black text-lg">{opp.roi}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Min. Investment</p>
                        <p className="font-black text-lg">{opp.min}</p>
                      </div>
                    </div>
                    <button className="w-full bg-primary text-white rounded-lg py-3 font-bold hover:bg-primary/90 transition-colors">
                      Invest Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Invest */}
        <section className="bg-primary/5 py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Our Promise</p>
              <h2 className="text-3xl md:text-4xl font-black">Financial Excellence &amp; Stewardship</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "visibility", title: "Transparent Reporting", desc: "Quarterly financial statements, audited accounts, and real-time dashboards for every investor." },
                { icon: "security", title: "Asset-Backed Security", desc: "Every investment is underpinned by tangible real estate assets, ensuring capital protection." },
                { icon: "eco", title: "ESG Commitment", desc: "All projects are assessed against environmental, social, and governance criteria before approval." },
              ].map((f) => (
                <div key={f.title} className="bg-white p-8 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
          <div className="bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Grow Your Wealth?</h2>
              <p className="text-white/80 mb-8">Schedule a free consultation with our investment advisory team.</p>
              <button className="bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors">
                Book a Free Call
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
