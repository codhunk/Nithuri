import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tourismProjects = [
  {
    title: "Eco Tourism Trails",
    category: "Nature & Wildlife",
    location: "Corbett, Uttarakhand",
    status: "Active",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPor5DYu_oc6tW8tb_X7eXQc2MSO1RHH_-YjcRWVXN_hqstGeo9a4KimNfCzYlhGo4tYx-QrfR_8XKsmz3TyfQW9PVFKGIEcNVroWvfGnDgbJ-UKaLokVwfxwpb2SwhSoKUE5FGbaOc_mw5NQGRq9-VIdjnOZS9mybrxm0YBVcdKMuJvQGnZmHoF45QCNgg9wIiNVVBQYppmHoEg2YuM5JO0bL_rYshSKxI1vRb1qJlwBQJ-mSzpWNJL1k7sknEsAD4sMn2IMs9qc",
    desc: "Sustainable nature trails and wildlife conservation hubs connecting visitors with pristine forest ecosystems.",
  },
  {
    title: "Lakeside Luxury Resort",
    category: "Resort Development",
    location: "Bhimtal, Uttarakhand",
    status: "Under Development",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT5Qnq266-rGlbpgOXcuzf7pjWK9882XWi7ado1O6nxzNDsTXwtLSR2xeGz0kSlgfkE5g0YJQzx_IlUyfKxtFGVtP2x923IsxlVN3_CT7b4zH59W0YC4RoGEDJ68VolOeVkB4B5UaA_lHTk9eLt-kQG2S296Y72Am-md07Xe1xWz9Jh8nKABwHnyhaMC4iXdal27tpeQyEX-biP9e0us0FZSC0US_ZxNbPGSRsQ0Xpv5juR3deW-SQ8mx2014ggcyr8xq1ba5O7xE",
    desc: "World-class hospitality experiences in serene mountain lake settings with panoramic Himalayan views.",
  },
  {
    title: "Blue Mirror Lake Park",
    category: "Lake Development",
    location: "Nainital, Uttarakhand",
    status: "Active",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
    desc: "Beautification projects and ecosystem management of pristine water bodies for recreation and conservation.",
  },
  {
    title: "Waterfront Cafe & Boating",
    category: "Boating & Recreation",
    location: "Sattal, Uttarakhand",
    status: "Active",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_9OmqoTFSSwuWKlfN9PeoaIta-hpQPR9w9C31eNmJdUFs8LaF3qbr84-ztqnA4ZtfIajhDU9RgGZPZSggxytAKBKLg2Frz4PMbC2Vd28JWGq3RrDFNUjDgt6Tp0jUZy2sLehvG9ZG-14VvdF4ThNn6Pu_GWJ69dUc7GBCFzZmZBoG1BhYYJHrXrcJsG0CVrAopeEw74m234ziQIjnMEeVLkC4mE0u8cK2F-wfHQYf1D4kJ5i_sk4T08rKhYzrRq5Pgey-znHAm7s",
    desc: "Family-friendly recreation, dining, and boating infrastructure at pristine lake destinations.",
  },
];

export default function TourismPage() {
  return (
    <div className="flex h-full grow flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 bg-slate-900 text-white px-6 md:px-20 overflow-hidden relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPor5DYu_oc6tW8tb_X7eXQc2MSO1RHH_-YjcRWVXN_hqstGeo9a4KimNfCzYlhGo4tYx-QrfR_8XKsmz3TyfQW9PVFKGIEcNVroWvfGnDgbJ-UKaLokVwfxwpb2SwhSoKUE5FGbaOc_mw5NQGRq9-VIdjnOZS9mybrxm0YBVcdKMuJvQGnZmHoF45QCNgg9wIiNVVBQYppmHoEg2YuM5JO0bL_rYshSKxI1vRb1qJlwBQJ-mSzpWNJL1k7sknEsAD4sMn2IMs9qc")` }} />
          <div className="max-w-[1400px] mx-auto relative z-10 text-center">
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Leisure &amp; Nature</p>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Tourism Development</h1>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-10">
              Promoting eco-conscious travel and premium hospitality infrastructure across India&apos;s most scenic destinations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Invest in Tourism
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors">
                View All Projects
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary text-white py-10 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "4+", label: "Active Projects" },
              { value: "3", label: "States" },
              { value: "10,000+", label: "Annual Visitors" },
              { value: "₹50 Cr+", label: "Infrastructure Value" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black mb-1">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Our Initiatives</p>
              <h2 className="text-3xl md:text-4xl font-black">Tourism Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tourismProjects.map((project) => (
                <div key={project.title} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="h-72 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={project.image}
                      alt={project.title}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${project.status === "Active" ? "bg-green-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">{project.title}</h3>
                    <p className="text-slate-300 flex items-center gap-1 text-sm mb-2">
                      <span className="material-symbols-outlined text-sm">location_on</span>{project.location}
                    </p>
                    <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Tourism Section */}
        <section className="bg-primary/5 py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Our Approach</p>
              <h2 className="text-3xl md:text-4xl font-black">Sustainable by Design</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "eco", title: "Eco-Conscious", desc: "All projects are designed to coexist with nature — minimal footprint, maximum harmony with local ecosystems." },
                { icon: "people", title: "Community First", desc: "We partner with local communities, creating employment and supporting indigenous culture through responsible tourism." },
                { icon: "trending_up", title: "High Returns", desc: "Tourism infrastructure offers 12–18% annual returns with government-backed incentives in eco-tourism zones." },
              ].map((f) => (
                <div key={f.title} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
          <div className="bg-slate-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Partner With Us in Tourism</h2>
              <p className="text-slate-300 mb-8">Join us in building the next generation of India&apos;s eco-tourism infrastructure.</p>
              <button className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors">
                Get in Touch
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
