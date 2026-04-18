"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { propertiesApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const { refreshUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [existingImages, setExistingImages] = useState<{ url: string; public_id?: string }[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // public_ids or urls
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "plot",
    listingType: "sell",
    city: "New Delhi",
    state: "Delhi",
    address: "",
    areaSize: "",
    areaUnit: "sqft",
    bedrooms: "0",
    bathrooms: "0",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertiesApi.getById(id as string);
        const p = res.data;
        setForm({
          title: p.title || "",
          description: p.description || "",
          price: (p.price || "").toString(),
          propertyType: p.propertyType || "plot",
          listingType: p.listingType || "sell",
          city: p.address?.city || "",
          state: p.address?.state || "",
          address: p.address?.street || "",
          areaSize: (p.area?.size || "").toString(),
          areaUnit: p.area?.unit || "sqft",
          bedrooms: (p.bedrooms || "0").toString(),
          bathrooms: (p.bathrooms || "0").toString(),
        });
        setExistingImages(p.images || []);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load property data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId: string | undefined, url: string) => {
    // If publicId exists, use it, otherwise use url as fallback
    const identifier = publicId || url;
    setDeletedImages(prev => [...prev, identifier]);
    setExistingImages(prev => prev.filter(img => (img.public_id || img.url) !== identifier));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("propertyType", form.propertyType);
      formData.append("listingType", form.listingType);
      formData.append("address[street]", form.address);
      formData.append("address[city]", form.city);
      formData.append("address[state]", form.state);
      formData.append("area[size]", form.areaSize);
      formData.append("area[unit]", form.areaUnit);
      formData.append("bedrooms", form.bedrooms);
      formData.append("bathrooms", form.bathrooms);

      // Tell backend which images to delete
      if (deletedImages.length > 0) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }

      files.forEach(file => {
        formData.append("images", file);
      });

      await propertiesApi.update(id as string, formData);
      router.push("/dashboard/my-listings");
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Property Details...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Edit Property</h1>
          <p className="text-slate-500 text-sm font-medium">Update your listing information</p>
        </div>
        <button onClick={() => router.back()} className="p-3 bg-slate-50 dark:bg-primary/5 rounded-2xl text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-red-700 dark:text-red-400 text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basics Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-primary/10">
          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 underline decoration-primary/30 underline-offset-4">Listing Title</label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Property Type</label>
                <select
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                >
                  <option value="plot">Land / Plot</option>
                  <option value="house">House / Villa</option>
                  <option value="apartment">Flat / Apartment</option>
                  <option value="commercial">Commercial Space</option>
                  <option value="farmhouse">Farmhouse</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Listing Type</label>
                <select
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  value={form.listingType}
                  onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                >
                  <option value="sell">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Price (INR)</label>
                <input
                  required
                  type="number"
                  className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Area Size</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                    value={form.areaSize}
                    onChange={(e) => setForm({ ...form, areaSize: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Unit</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none"
                    value={form.areaUnit}
                    onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Description</label>
              <textarea
                required
                rows={5}
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-3xl px-6 py-5 text-sm outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all dark:text-white resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-primary/10">
          <h2 className="text-xl font-black dark:text-white mb-8">Property Media</h2>
          
          <div className="space-y-8">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Images</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={img.url} alt="Existing" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.public_id, img.url)}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 backdrop-blur-sm"
                      >
                        <span className="material-symbols-outlined">delete</span>
                        <span className="text-[9px] font-black uppercase">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Uploads */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Upload New Images</p>
              <label className="block border-2 border-dashed border-slate-200 dark:border-primary/20 rounded-xl p-10 text-center hover:border-primary transition-all cursor-pointer bg-slate-50/50 dark:bg-primary/5">
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                <span className="material-symbols-outlined text-3xl text-primary mb-2">add_a_photo</span>
                <p className="text-xs font-bold text-slate-500">Click to add more images</p>
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-primary/20">
                      <img src={src} alt="New" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                      <span className="absolute bottom-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded">New</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-primary/10">
          <h2 className="text-xl font-black dark:text-white mb-8">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">City</label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">State</label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-8">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Street / Address</label>
            <input
              required
              type="text"
              className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl px-5 py-4 text-sm outline-none"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-6 items-center pb-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-100 transition-all font-primary uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 text-lg uppercase tracking-tighter"
          >
            {isSubmitting && <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
