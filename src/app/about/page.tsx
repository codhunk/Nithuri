import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  {
    name: "Bageshwar Singh",
    role: "Managing Director",
    bio: "Continuing the 25-year legacy of Shri Nithuri Singh, Bageshwar combines traditional values with modern strategic thinking to drive community growth and excellence.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKzLDK2INW5N13wwGrSXkfjxTvXt9k70KWcHz6GuOHQA44KB0ya_9uZUWeD5IuOPhas71Feo-cqmxKhrZOWPNEml_D9DZkRbU7HVyGKI9T4J2PHiRdinPoKhDBnSffKK5GAxxZv9uv0USlng13tNUd2x5aUJCZigS906kNyeuFU5eBdCVgYmt9HBfcp-aQCNGYD0rrTpxBOhNpu-OvZ1WccK7s3-tb9AqNdIh2awz-QYyEG39fV1ARFsnh2foA1gxmu7DnX5lzdjw",
    stats: [{ label: "Legacy Years", value: "25+" }, { label: "Happy Clients", value: "500+" }],
  },
  {
    name: "Rajesh Singh",
    role: "Head of Legal & Compliance",
    bio: "A seasoned legal professional with expertise in property law, land registration, and corporate governance. Rajesh ensures every transaction meets the highest ethical and legal standards.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKzLDK2INW5N13wwGrSXkfjxTvXt9k70KWcHz6GuOHQA44KB0ya_9uZUWeD5IuOPhas71Feo-cqmxKhrZOWPNEml_D9DZkRbU7HVyGKI9T4J2PHiRdinPoKhDBnSffKK5GAxxZv9uv0USlng13tNUd2x5aUJCZigS906kNyeuFU5eBdCVgYmt9HBfcp-aQCNGYD0rrTpxBOhNpu-OvZ1WccK7s3-tb9AqNdIh2awz-QYyEG39fV1ARFsnh2foA1gxmu7DnX5lzdjw",
    stats: [{ label: "Cases Resolved", value: "500+" }, { label: "Years Practice", value: "15+" }],
  },
  {
    name: "Priya Nithuri",
    role: "Director of Investments",
    bio: "Priya leads investor relations and portfolio management, bringing structured finance expertise to every project and ensuring transparent, high-yield returns for our partners.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKzLDK2INW5N13wwGrSXkfjxTvXt9k70KWcHz6GuOHQA44KB0ya_9uZUWeD5IuOPhas71Feo-cqmxKhrZOWPNEml_D9DZkRbU7HVyGKI9T4J2PHiRdinPoKhDBnSffKK5GAxxZv9uv0USlng13tNUd2x5aUJCZigS906kNyeuFU5eBdCVgYmt9HBfcp-aQCNGYD0rrTpxBOhNpu-OvZ1WccK7s3-tb9AqNdIh2awz-QYyEG39fV1ARFsnh2foA1gxmu7DnX5lzdjw",
    stats: [{ label: "AUM", value: "₹200 Cr+" }, { label: "Investors", value: "500+" }],
  },
];

const milestones = [
  { year: "2003", title: "Founded", desc: "Nithuri Singh & Sons was established in Uttarakhand with a vision to transform rural land markets." },
  { year: "2008", title: "Legal Division", desc: "Launched dedicated legal advisory services to protect client interests in complex property disputes." },
  { year: "2015", title: "Investment Arm", desc: "Structured investment portfolio created, offering verified opportunities to external investors." },
  { year: "2019", title: "Tourism Projects", desc: "Began eco-tourism infrastructure development across Nainital, Bhimtal, and Sattal." },
  { year: "2024", title: "Digital Platform", desc: "Launched online property listings and investor dashboard serving clients across India." },
];

export default function AboutPage() {
  return (
    <div className="flex h-full grow flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary py-20 px-6 md:px-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <p className="font-bold tracking-widest uppercase text-sm mb-3 text-white/70">Our Story</p>
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Building Trust, One Property at a Time
                </h1>
                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  For over two decades, Nithuri Singh &amp; Sons Associates has been the cornerstone of ethical real estate practice in Uttarakhand. Founded on values of transparency, integrity, and community, we have grown from a small regional firm to a trusted name across India.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "20+", label: "Years of Trust" },
                    { value: "500+", label: "Happy Clients" },
                    { value: "₹200 Cr+", label: "Property Transacted" },
                    { value: "12", label: "Active Projects" },
                  ].map((s) => (
                    <div key={s.label} className="border border-white/20 rounded-xl p-4">
                      <p className="text-3xl font-black mb-1">{s.value}</p>
                      <p className="text-white/60 text-sm">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative group">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 border-2 border-white/20 rounded-3xl -z-0 transform rotate-12" />

                <div className="w-full h-[350px] md:h-[450px] lg:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 ring-8 ring-white/5 transition-transform duration-500 hover:scale-[1.02]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="/director.png"
                    alt="Bageshwar Singh - Managing Director"
                  />
                  {/* Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
                </div>

                {/* Years of Experience badge */}
                <div className="absolute top-10 -right-4 md:-right-8 bg-white text-primary p-6 rounded-2xl shadow-2xl z-20 hidden md:block animate-float">
                  <p className="text-4xl font-black mb-1">25+</p>
                  <p className="text-[10px] uppercase font-black tracking-widest leading-none text-slate-400">Years of Legacy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Director's Vision */}
        <section className="py-24 px-6 md:px-20 bg-white">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-16">
              <span className="material-symbols-outlined text-6xl text-primary/20 mb-4 block animate-bounce">format_quote</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Director’s Thoughts &amp; Vision</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-xl text-slate-600 leading-relaxed font-medium italic">
                <p>
                  &quot;I believe that true entrepreneurship is not just about building businesses; it is about building communities. Coming from a family with a 25-year legacy in real estate built by my father, <strong>Shri Nithuri Singh</strong>, I learned early on that trust and transparency are the greatest currencies in any market.&quot;
                </p>
                <p>
                  &quot;My vision is to bridge traditional business values with modern, MBA-driven strategies. Whether it is providing a family with a dispute-free home, guiding a young mind toward the right career, or helping a local entrepreneur secure government funding, my goal is to create an ecosystem of growth.&quot;
                </p>
              </div>
              <div className="space-y-8">
                <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
                  &quot;I envision a future where top-tier business consultancy, complete property solutions, and dedicated social welfare are accessible to everyone in our zone. When our youth and our laborers grow, our society thrives.&quot;
                </p>
                <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <p className="text-primary font-black text-lg mb-2">Bageshwar Singh</p>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Managing Director</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-primary/5 py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-primary">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">track_changes</span>
              <h2 className="text-2xl font-black mb-3">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                To provide transparent, ethical, and comprehensive real estate, legal, and investment services that empower our clients to make informed decisions and build lasting wealth for their families and communities.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-slate-900">
              <span className="material-symbols-outlined text-slate-900 text-3xl mb-4 block">visibility</span>
              <h2 className="text-2xl font-black mb-3">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed">
                To be India&apos;s most trusted rural real estate and investment firm, recognized for our uncompromising integrity, community impact, and the sustainable development of land resources across the nation.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Our Journey</p>
              <h2 className="text-3xl md:text-4xl font-black">Key Milestones</h2>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-primary/20" />
              <div className="space-y-12">
                {milestones.map((m, i) => (
                  <div key={m.year} className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                      <div className={`inline-block bg-white rounded-xl border border-slate-100 shadow-sm p-5 ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                        <h3 className="font-black text-xl mb-1">{m.title}</h3>
                        <p className="text-slate-500 text-sm">{m.desc}</p>
                      </div>
                    </div>
                    <div className="relative z-10 flex-shrink-0 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-black text-xs text-center leading-tight">
                      {m.year}
                    </div>
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-primary/5 py-20 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Leadership</p>
              <h2 className="text-3xl md:text-4xl font-black">Meet Our Team</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="h-56 overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-all duration-700"
                      src={member.image}
                      alt={member.name}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-xl mb-0.5">{member.name}</h3>
                    <p className="text-primary text-sm font-bold mb-3">{member.role}</p>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      {member.stats.map((s) => (
                        <div key={s.label}>
                          <p className="font-black">{s.value}</p>
                          <p className="text-xs text-slate-400">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
              <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Work With Us?</h2>
              <p className="text-white/80 mb-8">Let&apos;s build your future together — one trusted transaction at a time.</p>
              <a
                href="/contact"
                className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
