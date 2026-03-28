import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const properties = [
  {
    id: 1,
    title: "Azure Modern Villa",
    price: "₹580,000",
    location: "Kilimani, KE",
    type: "Villa",
    area: "4,200 sq ft",
    beds: 5,
    baths: 4,
    tag: "Featured",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7MSs1lZXAako3P-lJhYt1psBGoOmDCc8Cy6jfQ4HqK9MPxPFQ3fBafmJTowcnQgR1OpiU_bH5jEK-7FDBMwuAuwX1rWB7ut384SlgkEDfh1LrqCm03TeCxq4wbyLF9QNdr_mEjZU3rlJaec3FJvkVZddxC00ms5GjWSiAJm5YAlvBhRd0pBxRWZua2IyTRlNjTqz9ZPqvnhGUXvlTHTcYQWhmN6mD880ChEJqZYqwBodBrMeFJ5E7JIxCnPZT-qIPV0ohCzxi8ag",
  },
  {
    id: 2,
    title: "Elite Loft Apartments",
    price: "₹320,000",
    location: "Westlands, KE",
    type: "Apartment",
    area: "1,800 sq ft",
    beds: 3,
    baths: 2,
    tag: "Hot Deal",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMhdUXrh9kemtPd-I2-mAgqN0-G6010BLyQk2OPLNMaQ2H-7nE9GY4Fqhc0-lH8QzixA0kOlJx8V9QHLacueqVCzl6PUV0Rpk5QZJJ58-VytrvLuRVApwL4IUx6_YOtCR2itbxIKb1O96Uww1zl2slxw_sRCiMH95Y60Cfh-mGmF63ysljTycdOSh_lBmJylwjbwYYr_C3QpwPwqhuaYrZ7r-6thQAfjvZNIv7chIMSqsn9AgwwavvKEFge-b4qSxUyL7Eon7L_Rc",
  },
  {
    id: 3,
    title: "Rustic Cedar Cottage",
    price: "₹195,000",
    location: "Karen, KE",
    type: "Cottage",
    area: "2,100 sq ft",
    beds: 3,
    baths: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsZRtyw9lbgqPSmfhGXRwF3m1Y6ix-JBAcBnDC4PyFn4slchtEzLudwoejrQAS9EirSh8AI8k7Y--NHnUaEW_F46R85SVkWn9OqPCsmNyo4FuhFXfmhajF5au5D_pndDrpxn7kFfcEdFDJy-AOXJRslwZtyoifGNnMCI2gm8I5kL-k-n7CU54FCFaswlDFqVDusSTG-jMCjaW6kc-kCouRfQJZQHI6pWSy_ue2AKMV01JtOs0pfaSXwa8oALE3M_jRiI7_Td2JUZ0",
  },
  {
    id: 4,
    title: "Midtown Corporate Hub",
    price: "₹1,200,000",
    location: "Nairobi CBD, KE",
    type: "Commercial",
    area: "8,500 sq ft",
    beds: 0,
    baths: 6,
    tag: "Commercial",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWVWh301ONDY1GSlZk85eI2cwMRuWGRsbM0m4DlYyBh_NbdkWNuUXrdivaYzd7N7PAAtovrUKE11fz1V7C_Qvp_5vH0Lj_q3n7bk9cNl5qZC4QVcnM9kshMmf5DH8xWS95iuA1OoYPS4FYGGHevi1f4Vudz7CBnzB_6lIpfIgcPh53zbjMLGEPlp2pgRe_XCnDhlFqAA2RbalJUvAUjLPFOHk_X0tLtnC_r05DkBmySFakXNm2uWLUz4sWcL8gvrZlufHr7eicrG4",
  },
  {
    id: 5,
    title: "Skyline Penthouse",
    price: "₹890,000",
    location: "Upper Hill, KE",
    type: "Penthouse",
    area: "3,200 sq ft",
    beds: 4,
    baths: 3,
    tag: "New Listing",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE8tOOBHXLb6T1Q1LTBlj-XoI9fbMbS6zrJGboT2gqxo8KEwsdVHXRzEDiVQz6ZhJiKKbBB6VmTpMeVnVviulZ4A7NoS5GTGCEd-MWGZ3aXzJaHddBhSo42wOF6hYdDpGaedb9QRlSRMd5flWyOtdl9_yi0WXVpDyrDyFYroJ2oJTnREYYyVMUdqkJyr9HK3dSnt-tGEVgdDsq5pjqhf_Ha0r30KUWmXrNmIl4Co3jSVxQYGwhaw7I4p3ucfEI-UbudrhD7ba__Ls",
  },
  {
    id: 6,
    title: "Suburban Family Haven",
    price: "₹420,000",
    location: "Runda, KE",
    type: "House",
    area: "3,600 sq ft",
    beds: 4,
    baths: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
  },
  {
    id: 7,
    title: "Suburban Family Haven",
    price: "₹420,000",
    location: "Runda, KE",
    type: "House",
    area: "3,600 sq ft",
    beds: 4,
    baths: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
  },
  {
    id: 8,
    title: "Suburban Family Haven",
    price: "₹420,000",
    location: "Runda, KE",
    type: "House",
    area: "3,600 sq ft",
    beds: 4,
    baths: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
  },
  {
    id: 9,
    title: "Suburban Family Haven",
    price: "₹420,000",
    location: "Runda, KE",
    type: "House",
    area: "3,600 sq ft",
    beds: 4,
    baths: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
  },
  {
    id: 10,
    title: "Suburban Family Haven",
    price: "₹420,000",
    location: "Runda, KE",
    type: "House",
    area: "3,600 sq ft",
    beds: 4,
    baths: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKBC4_FtrQhQz56aFCT-s-diTWg8vdwC5ugplmY-JmnBAfJ3SMTf2ynznYCxJL7dqJSZofkj1ZLgV5XBgpUOi_Q_cQij6keYhjZzx3NDAm2DtJP2ogRk-OHZYxWgcNEj6E7Z1LHtfaHUxuoUgJ8zxqU5zo0M9rzqdMtO8h5wEUukfcXxIwMTTTbzzsvGPfq6DutSucFn6N525ivwpKwqLEu--Z7rkDZhxKBiVdd4eC8MbTeRXBhYedTnSAi6fp0vYUZXsg6FWSEa8",
  },
];

export default function PropertiesPage() {
  return (
    <div className="flex h-full grow flex-col min-h-screen">
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-primary/5 py-16 px-6 md:px-20">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Browse</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Property Listings</h1>
            <p className="text-slate-600 text-lg">Discover premium land, homes, and commercial spaces across India.</p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-[72px] z-40 bg-white border-b border-slate-100 py-4 px-6 md:px-20 shadow-sm">
          <div className="max-w-[1400px] mx-auto flex flex-wrap gap-3 items-center">
            <div className="flex items-center bg-primary/5 rounded-lg px-3 h-10 gap-2">
              <span className="material-symbols-outlined text-primary text-base">location_on</span>
              <input className="bg-transparent border-none outline-none text-sm w-32" placeholder="Location" type="text" />
            </div>
            <select className="bg-primary/5 border-none outline-none rounded-lg px-3 h-10 text-sm text-slate-700">
              <option>All Types</option>
              <option>Land</option>
              <option>Villa</option>
              <option>Apartment</option>
              <option>Commercial</option>
            </select>
            <select className="bg-primary/5 border-none outline-none rounded-lg px-3 h-10 text-sm text-slate-700">
              <option>Any Price</option>
              <option>Under ₹200k</option>
              <option>₹200k–₹500k</option>
              <option>₹500k+</option>
            </select>
            <button className="ml-auto bg-primary text-white rounded-lg h-10 px-5 font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-base">tune</span> Filter
            </button>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-16 px-6 md:px-20 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <p className="text-slate-500 text-sm">{properties.length} properties found</p>
            <select className="border border-slate-200 rounded-lg px-3 h-9 text-sm text-slate-700 outline-none">
              <option>Sort: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p) => (
              <div key={p.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-100">
                <div
                  className="h-56 bg-cover bg-center relative"
                  style={{ backgroundImage: `url("${p.image}")` }}
                >
                  {p.tag && (
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      {p.tag}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {p.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-primary font-black">{p.price}</p>
                  </div>
                  <p className="text-slate-500 flex items-center gap-1 text-sm mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span> {p.location}
                  </p>
                  <div className="flex items-center gap-4 py-3 border-t border-slate-100 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-slate-400 text-sm">square_foot</span>{p.area}</span>
                    {p.beds > 0 && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-slate-400 text-sm">bed</span>{p.beds} Beds</span>}
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-slate-400 text-sm">bathtub</span>{p.baths} Baths</span>
                  </div>
                  <Link
                    href={`/properties/${p.id}`}
                    className="block w-full mt-3 py-2.5 text-center border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${n === 1 ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"}`}>
                {n}
              </button>
            ))}
            <button className="w-10 h-10 rounded-lg font-bold text-sm bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
