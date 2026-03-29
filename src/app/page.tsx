"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { propertiesApi, ApiError } from "@/lib/api";
import { formatAddress } from "@/lib/utils";

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await propertiesApi.getAll({ limit: "3" });
        setFeatured(res.data);
      } catch (err) {
        console.error("Failed to load featured properties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen dark:bg-background-dark transition-colors duration-300">
      <Navbar />

      <main>
        {/* ... Hero and Search ... */}
        {/* Skipping unchanged Hero and Search content for brevity in this tool call, but you'll apply it in the file. */}
        {/* I'll use the placeholder for the hero/search part below since replace_file_content needs exact match. */}
        {/* ── Hero Section ──────────────────────────────────────── */}
        <section className="relative">
          <div
            className="flex min-h-[600px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-6 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url("https://lh3.googleusercontent.com/aida-public/AB6AXuColh5p-9r2JQYRS7F4zRSRxp0m8lyxjrRGqnWkureR0AeQnS6BxAluzBEZduU34sKeD0gEAdgslvKr4ZcRHC3iV2qkeyM16cwUxUUU8FqCQ_wr7mrXUMWFvNji-6GugYOvDDt3HWkpseJrzOAU4M5b2tzAYLX7kQa6lRe_uIvSYa3XR_RKPLpiacjMSjMYkFvcpUJ-7vciqV8fcFBxN1OExmY5mYtC0rul3LwCYX-aoi5sWz9ZGCisyGvZ7cY4EAoz_jryCIcFWEI")`,
            }}
          >
            <div className="max-w-4xl flex flex-col gap-4">
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Find Land, Opportunities &amp; Guidance in One Place
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-normal max-w-2xl mx-auto">
                Connecting you with premium real estate, professional advisory,
                and sustainable investment opportunities.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold shadow-lg hover:bg-primary/90 transition-colors">
                Search Property
              </button>
              <Link
                href="/dashboard/add-property"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white text-primary text-base font-bold shadow-lg hover:bg-slate-50 transition-colors"
                aria-label="Post Your Property"
              >
                Post Your Property
              </Link>
            </div>
          </div>
        </section>

        {/* ── Advanced Search Bar ───────────────────────────────── */}
        <section className="max-w-[1100px] mx-auto w-full -mt-16 relative z-10 px-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl border border-primary/5 dark:border-primary/20 transition-colors duration-300">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">manage_search</span>
              Advanced Property Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">Location</label>
                <div className="flex items-center bg-primary/5 dark:bg-primary/20 rounded-lg px-3 h-12">
                  <span className="material-symbols-outlined text-primary mr-2">location_on</span>
                  <input className="bg-transparent border-none outline-none focus:ring-0 w-full text-sm dark:text-white dark:placeholder:text-slate-400" placeholder="City or Region" type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">Price Range</label>
                <div className="flex items-center bg-primary/5 dark:bg-primary/20 rounded-lg px-3 h-12">
                  <span className="material-symbols-outlined text-primary mr-2">payments</span>
                  <select className="bg-transparent border-none outline-none focus:ring-0 w-full text-sm dark:text-white">
                    <option className="dark:bg-slate-800">Any Price</option>
                    <option className="dark:bg-slate-800">₹50k – ₹100k</option>
                    <option className="dark:bg-slate-800">₹100k – ₹500k</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">Property Type</label>
                <div className="flex items-center bg-primary/5 dark:bg-primary/20 rounded-lg px-3 h-12">
                  <span className="material-symbols-outlined text-primary mr-2">home_work</span>
                  <select className="bg-transparent border-none outline-none focus:ring-0 w-full text-sm dark:text-white">
                    <option className="dark:bg-slate-800">All Types</option>
                    <option className="dark:bg-slate-800">Agricultural Land</option>
                    <option className="dark:bg-slate-800">Commercial Plot</option>
                    <option className="dark:bg-slate-800">Residential</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-end">
                <button className="bg-primary text-white rounded-lg h-12 font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined">search</span> Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Properties ───────────────────────────────── */}
        <section className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div className="dark:text-white">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Featured Listings</p>
              <h2 className="text-3xl md:text-4xl font-black dark:text-white">Handpicked Properties for You</h2>
            </div>
            <Link className="text-primary font-bold flex items-center gap-1 hover:underline" href="/properties">
              View All <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
              ))
            ) : featured.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">No properties available yet.</div>
            ) : (
              featured.map((p) => (
                <PropertyCard
                  key={p._id}
                  id={p._id}
                  title={p.title}
                  price={`₹${(p.price / 10000000).toFixed(2)} Cr`}
                  location={formatAddress(p.address)}
                  tag={p.listingType}
                  features={[
                    { icon: "square_foot", label: `${p.area?.size} ${p.area?.unit}` },
                    { icon: "bed", label: `${p.bedrooms || 0} BHK` },
                  ]}
                  image={p.images?.[0]?.url || "/placeholder.jpg"}
                />
              ))
            )}
          </div>
        </section>

        {/* ── Services Section ──────────────────────────────────── */}
        <section className="bg-primary/5 dark:bg-primary/10 py-20 px-6 md:px-20 transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">What We Do</p>
              <h2 className="text-3xl md:text-5xl font-black dark:text-white">Comprehensive Expertise</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceCard icon="real_estate_agent" title="Real Estate" desc="Full-cycle land procurement and development services tailored to your specific needs." />
              <ServiceCard icon="query_stats" title="Business Consultancy" desc="Strategic advice to scale your business and optimize your operational efficiency." />
              <ServiceCard icon="gavel" title="Legal Advisory" desc="Expert legal navigation for property disputes, land registration, and corporate compliance." />
              <ServiceCard icon="diversity_3" title="Social Welfare" desc="Committed to community growth through ethical development and social initiatives." />
            </div>
          </div>
        </section>

        {/* ── Investor Opportunities ────────────────────────────── */}
        <section className="py-20 px-6 md:px-20 max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">High-Yield Projects</p>
              <h2 className="text-3xl md:text-5xl font-black mb-6">Investor Opportunities</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Join our mission to transform under-utilized land into high-value assets. We offer structured investment opportunities in land banking, commercial hubs, and green-energy projects.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">check</span>
                  <div>
                    <h4 className="font-bold">Transparent Reporting</h4>
                    <p className="text-sm text-slate-500">Regular updates and full financial visibility on all projects.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full">check</span>
                  <div>
                    <h4 className="font-bold">Sustainable Returns</h4>
                    <p className="text-sm text-slate-500">Focused on long-term value creation and social impact.</p>
                  </div>
                </div>
              </div>
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                Download Investor Deck
              </button>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden h-64 shadow-lg">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE8tOOBHXLb6T1Q1LTBlj-XoI9fbMbS6zrJGboT2gqxo8KEwsdVHXRzEDiVQz6ZhJiKKbBB6VmTpMeVnVviulZ4A7NoS5GTGCEd-MWGZ3aXzJaHddBhSo42wOF6hYdDpGaedb9QRlSRMd5flWyOtdl9_yi0WXVpDyrDyFYroJ2oJTnREYYyVMUdqkJyr9HK3dSnt-tGEVgdDsq5pjqhf_Ha0r30KUWmXrNmIl4Co3jSVxQYGwhaw7I4p3ucfEI-UbudrhD7ba__Ls" alt="Construction" />
                </div>
                <div className="bg-primary p-6 rounded-xl text-white">
                  <p className="text-4xl font-black mb-1">15%+</p>
                  <p className="text-sm opacity-80">Average Annual ROI</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-slate-900 p-6 rounded-xl text-white">
                  <p className="text-4xl font-black mb-1">12</p>
                  <p className="text-sm opacity-80">Active Projects</p>
                </div>
                <div className="rounded-xl overflow-hidden h-64 shadow-lg">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWVWh301ONDY1GSlZk85eI2cwMRuWGRsbM0m4DlYyBh_NbdkWNuUXrdivaYzd7N7PAAtovrUKE11fz1V7C_Qvp_5vH0Lj_q3n7bk9cNl5qZC4QVcnM9kshMmf5DH8xWS95iuA1OoYPS4FYGGHevi1f4Vudz7CBnzB_6lIpfIgcPh53zbjMLGEPlp2pgRe_XCnDhlFqAA2RbalJUvAUjLPFOHk_X0tLtnC_r05DkBmySFakXNm2uWLUz4sWcL8gvrZlufHr7eicrG4" alt="Office" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tourism Development ───────────────────────────────── */}
        <section className="py-20 bg-slate-900 dark:bg-slate-950 text-white px-6 md:px-20 overflow-hidden relative transition-colors duration-300">
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-16">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Leisure &amp; Nature</p>
              <h2 className="text-3xl md:text-5xl font-black">Tourism Development</h2>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Promoting eco-conscious travel and premium hospitality infrastructure.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TourismCard
                title="Eco Tourism"
                desc="Sustainable nature trails and wildlife conservation hubs."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBPor5DYu_oc6tW8tb_X7eXQc2MSO1RHH_-YjcRWVXN_hqstGeo9a4KimNfCzYlhGo4tYx-QrfR_8XKsmz3TyfQW9PVFKGIEcNVroWvfGnDgbJ-UKaLokVwfxwpb2SwhSoKUE5FGbaOc_mw5NQGRq9-VIdjnOZS9mybrxm0YBVcdKMuJvQGnZmHoF45QCNgg9wIiNVVBQYppmHoEg2YuM5JO0bL_rYshSKxI1vRb1qJlwBQJ-mSzpWNJL1k7sknEsAD4sMn2IMs9qc"
              />
              <TourismCard
                title="Resort Development"
                desc="World-class hospitality experiences in serene locations."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDT5Qnq266-rGlbpgOXcuzf7pjWK9882XWi7ado1O6nxzNDsTXwtLSR2xeGz0kSlgfkE5g0YJQzx_IlUyfKxtFGVtP2x923IsxlVN3_CT7b4zH59W0YC4RoGEDJ68VolOeVkB4B5UaA_lHTk9eLt-kQG2S296Y72Am-md07Xe1xWz9Jh8nKABwHnyhaMC4iXdal27tpeQyEX-biP9e0us0FZSC0US_ZxNbPGSRsQ0Xpv5juR3deW-SQ8mx2014ggcyr8xq1ba5O7xE"
              />
              <TourismCard
                title="Lake Development"
                desc="Beautification and ecosystem management of water bodies."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8"
              />
              <TourismCard
                title="Boating &amp; Cafe"
                desc="Family-friendly recreation and dining at the water's edge."
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuC_9OmqoTFSSwuWKlfN9PeoaIta-hpQPR9w9C31eNmJdUFs8LaF3qbr84-ztqnA4ZtfIajhDU9RgGZPZSggxytAKBKLg2Frz4PMbC2Vd28JWGq3RrDFNUjDgt6Tp0jUZy2sLehvG9ZG-14VvdF4ThNn6Pu_GWJ69dUc7GBCFzZmZBoG1BhYYJHrXrcJsG0CVrAopeEw74m234ziQIjnMEeVLkC4mE0u8cK2F-wfHQYf1D4kJ5i_sk4T08rKhYzrRq5Pgey-znHAm7s"
              />
            </div>
          </div>
        </section>

        {/* ── Founder Section ───────────────────────────────────── */}
        <section className="py-24 px-6 md:px-20 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-2/5 relative group">
                <div className="w-full aspect-square md:aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl z-10 relative ring-[12px] ring-primary/5 transition-transform duration-700 hover:scale-[1.03]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src="/director.png"
                    alt="Bageshwar Singh"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Decorative Accents */}
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/10 rounded-[3rem] -z-0 animate-pulse" />
                <div className="absolute -top-8 -left-8 w-24 h-24 border-8 border-primary/10 rounded-3xl -z-0" />
              </div>
              <div className="md:w-3/5">
                <p className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Legacy & Leadership</p>
                <h2 className="text-3xl md:text-5xl font-black mb-6 dark:text-white leading-tight">Director’s Thoughts &amp; Vision</h2>

                <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed italic border-l-4 border-primary pl-6 font-medium">
                  <p>
                    &quot;I believe that true entrepreneurship is not just about building businesses; it is about building communities. Coming from a family with a 25-year legacy in real estate built by my father, <strong>Shri Nithuri Singh</strong>, I learned early on that trust and transparency are the greatest currencies in any market.&quot;
                  </p>
                  <p>
                    &quot;My vision is to bridge traditional business values with modern, MBA-driven strategies. Whether it is providing a family with a dispute-free home, guiding a young mind toward the right career, or helping a local entrepreneur secure government funding, my goal is to create an ecosystem of growth.&quot;
                  </p>
                  <p>
                    &quot;I envision a future where top-tier business consultancy, complete property solutions, and dedicated social welfare are accessible to everyone in our zone. When our youth and our laborers grow, our society thrives.&quot;
                  </p>
                </div>

                <div className="flex gap-8 mt-10">
                  <div className="pt-2">
                    <p className="text-2xl font-black">25+</p>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Year Legacy</p>
                  </div>
                  <div className="pt-2 border-l border-slate-200 dark:border-slate-700 pl-8">
                    <p className="text-2xl font-black">500+</p>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Growth Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ───────────────────────────────────────── */}
        {/* <section className="px-6 md:px-20 mb-20 max-w-[1400px] mx-auto dark:text-white transition-colors duration-300">
          <div className="bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take the Next Step?</h2>
              <p className="text-white/80 text-lg mb-10">
                Whether you&apos;re looking to buy, sell, or invest, our experts are here to guide you through every process.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors">
                  List Your Property Today
                </button>
                <button className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
                  Speak to an Advisor
                </button>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function PropertyCard({
  id,
  title,
  price,
  location,
  tag,
  features,
  image,
}: {
  id: string;
  title: string;
  price: string;
  location: string;
  tag?: string;
  features: { icon: string; label: string }[];
  image: string;
}) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700">
      <div
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url("${image}")` }}
      >
        {tag && (
          <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
            {tag}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors dark:text-white line-clamp-1">{title}</h3>
          <p className="text-primary font-bold text-lg">{price}</p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-sm mb-4">
          <span className="material-symbols-outlined text-sm">location_on</span> {location}
        </p>
        <div className="flex items-center gap-4 py-4 border-t border-slate-100 dark:border-slate-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-1 text-xs font-bold dark:text-slate-200 uppercase tracking-tighter">
              <span className="material-symbols-outlined text-slate-400 text-sm">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
        <Link
          href={`/properties/${id}`}
          className="block w-full mt-2 py-3 border-2 border-primary text-primary text-center font-black text-sm rounded-lg hover:bg-primary hover:text-white transition-colors uppercase tracking-widest"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function ServiceCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border-b-4 border-primary hover:-translate-y-2 transition-transform">
      <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TourismCard({ title, desc, image }: { title: string; desc: string; image: string }) {
  return (
    <div className="group relative rounded-xl overflow-hidden h-[400px]">
      <img
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        src={image}
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mt-2">{desc}</p>
      </div>
    </div>
  );
}
