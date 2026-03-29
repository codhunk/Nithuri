"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { propertiesApi, ApiError } from "@/lib/api";

export default function AddPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "plot", // Changed to match backend enum
    listingType: "sell",  // Changed to match backend enum
    city: "New Delhi",
    state: "Delhi",
    address: "",
    areaSize: "",
    areaUnit: "sqft",
    bedrooms: "0",
    bathrooms: "0",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (files.length < 1) throw new Error("Please upload at least one image");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("propertyType", form.propertyType);
      formData.append("listingType", form.listingType);

      // Map address fields
      formData.append("address[street]", form.address);
      formData.append("address[city]", form.city);
      formData.append("address[state]", form.state);

      // Map area fields
      formData.append("area[size]", form.areaSize);
      formData.append("area[unit]", form.areaUnit);

      formData.append("bedrooms", form.bedrooms);
      formData.append("bathrooms", form.bathrooms);

      files.forEach(file => {
        formData.append("images", file);
      });

      await propertiesApi.create(formData);
      router.push("/dashboard/my-listings");
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : err.message || "Failed to create listing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-12 transition-all duration-300">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2 animate-shake">
          <span className="material-symbols-outlined">error</span>
          <div className="flex-1">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basics */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-primary/10">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-50 dark:border-primary/5 pb-5">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">home_work</span>
            </div>
            <div>
              <h2 className="text-xl font-black dark:text-white leading-tight">Property Details</h2>
              <p className="text-xs text-slate-500 font-medium">Help buyers find your property with accurate info</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 underline decoration-primary/30 underline-offset-4">Listing Title</label>
              <input
                required
                type="text"
                placeholder="e.g. 500 Sq Yards Industrial Plot in Sector 12"
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Property Type</label>
                <select
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white appearance-none"
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                >
                  {[
                    { val: "plot", lab: "Land / Plot" },
                    { val: "house", lab: "House / Villa" },
                    { val: "apartment", lab: "Flat / Apartment" },
                    { val: "commercial", lab: "Commercial Space" },
                    { val: "farmhouse", lab: "Farmhouse" }
                  ].map(t => (
                    <option key={t.val} value={t.val} className="dark:bg-slate-900">{t.lab}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Listing Type</label>
                <select
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white appearance-none"
                  value={form.listingType}
                  onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                >
                  {[
                    { val: "sell", lab: "For Sale" },
                    { val: "rent", lab: "For Rent" },
                    { val: "lease", lab: "For Lease" }
                  ].map(t => (
                    <option key={t.val} value={t.val} className="dark:bg-slate-900">{t.lab}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Price (INR)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors font-bold">₹</span>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 14500000"
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl pl-10 pr-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Area Size</label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 1500"
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                    value={form.areaSize}
                    onChange={(e) => setForm({ ...form, areaSize: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Unit</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white appearance-none"
                    value={form.areaUnit}
                    onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
                  >
                    {["sqft", "sqm", "bigha", "acre", "marla"].map(u => (
                      <option key={u} value={u} className="dark:bg-slate-900">{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Description</label>
              <textarea
                required
                rows={5}
                placeholder="Give a detailed overview of the property, its history, and why someone should buy it..."
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-3xl px-6 py-5 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-primary/10">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-50 dark:border-primary/5 pb-5">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">image_search</span>
            </div>
            <h2 className="text-xl font-black dark:text-white">Property Media</h2>
          </div>

          <div className="space-y-6">
            <label className="block border-2 border-dashed border-slate-200 dark:border-primary/20 rounded-xl p-16 text-center hover:border-primary/50 transition-all cursor-pointer bg-slate-50/50 dark:bg-primary/5 group">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
              </div>
              <h3 className="text-lg font-black mb-1 dark:text-white">Upload Property Images</h3>
              <p className="text-sm text-slate-500 font-medium">PNG, JPG or WEBP (Max 10MB each)</p>
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-3xl overflow-hidden group border-2 border-slate-100 dark:border-primary/10 shadow-lg">
                    <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                    {i === 0 && <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-primary/10">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-50 dark:border-primary/5 pb-5">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <h2 className="text-xl font-black dark:text-white">Location Details</h2>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">City</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">State / Region</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Street / Landmark</label>
              <input
                required
                type="text"
                placeholder="Street name, Village name or Landmark"
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 items-center pb-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-primary/10 transition-all"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 text-lg"
          >
            {isLoading && <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />}
            {isLoading ? "Publishing..." : "Post Property"}
          </button>
        </div>
      </form>
    </div>
  );
}
