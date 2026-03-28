import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="flex h-full grow flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary/5 py-16 px-6 md:px-20">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Reach Out</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
            <p className="text-slate-600 text-lg max-w-2xl font-medium">
              Connect with our legal experts for personalized consultancy and comprehensive legal solutions tailored to your needs.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 md:px-20">
          <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="lg:w-3/5 bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-slate-100 p-8 md:p-12">
              <h2 className="text-3xl font-black mb-6">Send us a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                  <input
                    className="bg-slate-50 dark:bg-primary/5 rounded-xl px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary transition-all transition-all"
                    placeholder="Bageshwar"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                  <input
                    className="bg-slate-50 dark:bg-primary/5 rounded-xl px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary transition-all transition-all"
                    placeholder="Singh"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <input
                  className="bg-slate-50 dark:bg-primary/5 rounded-xl px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary transition-all transition-all"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                <input
                  className="bg-slate-50 dark:bg-primary/5 rounded-xl px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary transition-all transition-all"
                  placeholder="+91 98765 43210"
                  type="tel"
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                <select className="bg-slate-50 dark:bg-primary/5 rounded-xl px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary transition-all transition-all text-slate-700">
                  <option>Property Inquiry</option>
                  <option>Investment Opportunity</option>
                  <option>Legal Advisory</option>
                  <option>Business Consultancy</option>
                  <option>General Query</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Message</label>
                <textarea
                  className="bg-slate-50 dark:bg-primary/5 rounded-xl px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary transition-all transition-all resize-none"
                  rows={5}
                  placeholder="How can we help you today?"
                />
              </div>
              <button className="w-full bg-primary text-white rounded-xl py-5 font-black text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transform active:scale-[0.98] transition-all">
                Submit Inquiry
              </button>
            </div>

            {/* Contact Info */}
            <div className="lg:w-2/5 space-y-6">
              {[
                {
                  icon: "location_on",
                  title: "Main Office",
                  lines: ["Tetari Bazar, Near Bus Stand", "Siddharthnagar, UP 272202"],
                },
                {
                  icon: "call",
                  title: "Phone",
                  lines: ["+91 98765 43210", "Available 24/7 for Inquiry"],
                },
                {
                  icon: "mail",
                  title: "Email",
                  lines: ["info@nithurisingh.com", "support@nithurisingh.com"],
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-5 items-start bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1">{item.title}</h3>
                    {item.lines.map((l, i) => (
                      <p key={i} className="text-slate-500 text-sm font-medium">{l}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-500 text-white rounded-[1.5rem] py-5 font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-100 hover:shadow-green-200"
              >
                <span className="material-symbols-outlined text-2xl">chat</span>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* Location Map Section */}
        <section className="px-6 md:px-20 pb-24 max-w-[1100px] mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black mb-3">Visit our Office</h2>
            <p className="text-slate-500 font-medium">Find us at our central regional headquarters in Siddharthnagar.</p>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 overflow-hidden ring-1 ring-slate-200/50">
            <div className="h-[450px] w-full relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.458647328952!2d83.49229667523274!3d27.141856076511374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996af00288b6a7f%3A0x82128d57629f0452!2sNithuri%20singh%20and%20sons%20associates!5e0!3m2!1sen!2sin!4v1774702432877!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="p-8 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100">
              <div className="text-center sm:text-left">
                 <p className="font-black text-slate-900 text-lg">Nithuri Singh & Sons Associates</p>
                 <p className="text-sm text-slate-500 font-medium italic">Tetari Bazar, Siddharthnagar, Uttar Pradesh 272202</p>
              </div>
              <a
                href="https://www.google.com/maps/dir//Nithuri+singh+and+sons+associates/@27.1418561,83.4922967,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3996af00288b6a7f:0x82128d57629f0452!2m2!1d83.4948716!2d27.1418561?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-xl font-black text-sm hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">directions</span>
                Get Directions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
