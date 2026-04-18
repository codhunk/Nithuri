"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { formatAddress } from "@/lib/utils";
import { propertiesApi, ApiError } from "@/lib/api";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    type: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest"
  });

  const fetchProperties = async (page = 1) => {
    setIsLoading(true);
    try {
      const queryParams: any = {
        page: String(page),
        sort: filters.sort
      };

      if (filters.search) queryParams.search = filters.search;
      if (filters.city) queryParams.city = filters.city;
      if (filters.type) queryParams.type = filters.type;
      if (filters.listingType) queryParams.listingType = filters.listingType;
      if (filters.minPrice) queryParams.minPrice = filters.minPrice;
      if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;

      const res = await propertiesApi.getAll(queryParams);
      setProperties(res.data);
      if (res.pagination) {
        setPagination({ page: res.pagination.page, pages: res.pagination.pages });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load properties.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
  }, [filters.sort, filters.listingType, filters.type]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(1);
  };

  return (
    <div className="flex h-full grow flex-col min-h-screen bg-slate-50 transition-colors duration-300">
      <Navbar />
      <main>
        {/* Page Header & Search */}
        <section className="bg-white pt-16 pb-12 px-6 md:px-20 border-b border-slate-100">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-12">
              <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Advanced Search</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Find Your <span className="text-primary">Perfect</span> Space</h1>
            </div>

            {/* Filter Bar */}
            <form onSubmit={handleSearch} className="bg-white p-4 md:p-2 rounded-[2rem] border border-slate-200 shadow-2xl shadow-primary/5 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-6 py-3 border-r border-slate-100">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input
                  type="text"
                  placeholder="Search by title or keywords..."
                  className="w-full bg-transparent outline-none text-sm font-bold"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-6 py-3 border-r border-slate-100">
                <span className="material-symbols-outlined text-slate-400">location_on</span>
                <input
                  type="text"
                  placeholder="Enter City..."
                  className="w-full bg-transparent outline-none text-sm font-bold"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 lg:flex items-center gap-2 p-2">
                <select
                  className="bg-slate-50 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-none outline-none"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="farmhouse">Farmhouse</option>
                </select>
                <select
                  className="bg-slate-50 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-none outline-none"
                  value={filters.listingType}
                  onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
                >
                  <option value="">Any Offer</option>
                  <option value="sell">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <button type="submit" className="bg-primary text-white col-span-2 lg:w-32 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-center flex justify-center items-center">
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-12 px-6 md:px-20 max-w-[1400px] mx-auto min-h-[400px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                Found {properties.length} Active Listings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sort By:</span>
              <select
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none hover:border-primary transition-colors cursor-pointer"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error_outline</span>
              <p className="text-slate-600 font-bold">{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">search_off</span>
              <h3 className="text-xl font-bold uppercase tracking-tight">No Matching Properties</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">We couldn't find any listings matching your current filters. Try loosening your search criteria.</p>
              <button
                onClick={() => setFilters({ search: "", city: "", type: "", listingType: "", minPrice: "", maxPrice: "", sort: "newest" })}
                className="mt-6 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((p) => (
                  <div key={p._id} className="group bg-white rounded-xl overflow-hidden shadow-2xl shadow-black/5 hover:shadow-primary/10 transition-all border border-slate-100 flex flex-col hover:-translate-y-2 duration-500">
                    <div className="h-64 relative overflow-hidden">
                      <img
                        src={p.images?.[0]?.url || "/placeholder.jpg"}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                        {p.propertyType}
                      </div>
                      <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-xl shadow-primary/20">
                        {p.listingType === "sell" ? "For Sale" : "For Rent"}
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight line-clamp-1">{p.title}</h3>
                          <p className="text-primary font-bold text-xl whitespace-nowrap">₹{(p.price / 10000000).toFixed(2)} Cr</p>
                        </div>
                        <p className="text-slate-500 flex items-center gap-1.5 text-xs font-bold mb-6">
                          <span className="material-symbols-outlined text-primary text-base">location_on</span> {formatAddress(p.address)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-6 py-4 border-y border-slate-50 text-[10px] font-bold uppercase text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-hide">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg opacity-40">square_foot</span>
                            {p.area?.size} {p.area?.unit}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg opacity-40">bed</span>
                            {p.bedrooms || 0} BHK
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg opacity-40">bathtub</span>
                            {p.bathrooms || 0}
                          </span>
                        </div>

                        <Link
                          href={`/properties/${p._id}`}
                          className="mt-6 block w-full text-center bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 hover:shadow-primary/30 uppercase tracking-widest text-xs active:scale-95"
                        >
                          View Full Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-16">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => fetchProperties(n)}
                      className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all shadow-lg ${n === pagination.page
                        ? "bg-primary text-white shadow-primary/20"
                        : "bg-white border border-slate-100 text-slate-500 hover:border-primary hover:text-primary shadow-black/5"
                        }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
