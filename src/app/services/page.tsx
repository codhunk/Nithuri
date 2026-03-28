import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: "real_estate_agent",
    title: "Real Estate",
    tagline: "Buy, Sell & Develop",
    desc: "Full-cycle land procurement and development services tailored to your specific needs. From due diligence and site selection to regulatory clearances and final transaction.",
    features: ["Land Procurement", "Site Evaluation", "Title Verification", "Legal Documentation", "Registration Support"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7MSs1lZXAako3P-lJhYt1psBGoOmDCc8Cy6jfQ4HqK9MPxPFQ3fBafmJTowcnQgR1OpiU_bH5jEK-7FDBMwuAuwX1rWB7ut384SlgkEDfh1LrqCm03TeCxq4wbyLF9QNdr_mEjZU3rlJaec3FJvkVZddxC00ms5GjWSiAJm5YAlvBhRd0pBxRWZua2IyTRlNjTqz9ZPqvnhGUXvlTHTcYQWhmN6mD880ChEJqZYqwBodBrMeFJ5E7JIxCnPZT-qIPV0ohCzxi8ag",
  },
  {
    icon: "query_stats",
    title: "Business Consultancy",
    tagline: "Strategy & Growth",
    desc: "Strategic advice to scale your business and optimize your operational efficiency. We work across sectors — agriculture, hospitality, retail, and manufacturing.",
    features: ["Market Research", "Business Planning", "Financial Modeling", "Regulatory Advisory", "Government Scheme Access"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWVWh301ONDY1GSlZk85eI2cwMRuWGRsbM0m4DlYyBh_NbdkWNuUXrdivaYzd7N7PAAtovrUKE11fz1V7C_Qvp_5vH0Lj_q3n7bk9cNl5qZC4QVcnM9kshMmf5DH8xWS95iuA1OoYPS4FYGGHevi1f4Vudz7CBnzB_6lIpfIgcPh53zbjMLGEPlp2pgRe_XCnDhlFqAA2RbalJUvAUjLPFOHk_X0tLtnC_r05DkBmySFakXNm2uWLUz4sWcL8gvrZlufHr7eicrG4",
  },
  {
    icon: "gavel",
    title: "Legal Advisory",
    tagline: "Compliance & Protection",
    desc: "Expert legal navigation for property disputes, land registration, and corporate compliance. Our experienced legal team ensures your interests are fully protected.",
    features: ["Property Dispute Resolution", "Land Registration", "Corporate Compliance", "Contract Drafting", "Court Representation"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE8tOOBHXLb6T1Q1LTBlj-XoI9fbMbS6zrJGboT2gqxo8KEwsdVHXRzEDiVQz6ZhJiKKbBB6VmTpMeVnVviulZ4A7NoS5GTGCEd-MWGZ3aXzJaHddBhSo42wOF6hYdDpGaedb9QRlSRMd5flWyOtdl9_yi0WXVpDyrDyFYroJ2oJTnREYYyVMUdqkJyr9HK3dSnt-tGEVgdDsq5pjqhf_Ha0r30KUWmXrNmIl4Co3jSVxQYGwhaw7I4p3ucfEI-UbudrhD7ba__Ls",
  },
  {
    icon: "diversity_3",
    title: "Social Welfare",
    tagline: "Community & Impact",
    desc: "Committed to community growth through ethical development and social initiatives. We channel a portion of every project into local education, health, and infrastructure.",
    features: ["Rural Development", "Education Initiatives", "Health Camps", "Skill Development", "Women Empowerment Programs"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex h-full grow flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary/5 py-16 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">What We Offer</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Comprehensive Expertise</h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              From land procurement to legal advisory, we offer end-to-end services designed to help you succeed at every stage.
            </p>
          </div>
        </section>

        {/* Services Detail */}
        <section className="px-6 md:px-20 py-16">
          <div className="max-w-[1400px] mx-auto space-y-24">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                {/* Image */}
                <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-xl h-80">
                  <img className="w-full h-full object-cover" src={service.image} alt={service.title} />
                </div>
                {/* Content */}
                <div className="lg:w-1/2">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">{service.icon}</span>
                  </div>
                  <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">{service.tagline}</p>
                  <h2 className="text-3xl font-black mb-4">{service.title}</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">{service.desc}</p>
                  <ul className="space-y-2 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-700">
                        <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-primary text-white px-7 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-primary/5 py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-black">Our Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", icon: "search", title: "Consultation", desc: "We begin with a detailed needs assessment to understand your goals and scope." },
                { step: "02", icon: "fact_check", title: "Due Diligence", desc: "Thorough research, verification, and legal checks on all relevant documents." },
                { step: "03", icon: "handshake", title: "Execution", desc: "We guide you through every step of the transaction or project delivery." },
                { step: "04", icon: "verified", title: "Post-Service Support", desc: "Ongoing support, follow-up, and compliance assistance after project completion." },
              ].map((step) => (
                <div key={step.step} className="bg-white rounded-2xl p-6 shadow-sm text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black">
                    {step.step}
                  </div>
                  <div className="mt-4 mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
          <div className="bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Need Expert Guidance?</h2>
              <p className="text-white/80 mb-8">Our team of specialists is ready to help you with your real estate, legal, or business needs.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                  Book a Consultation
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors">
                  Call Us Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
