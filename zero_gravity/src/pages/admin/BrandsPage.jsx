import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  supabase,
} from "@/lib/supabase";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [brandCounts, setBrandCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Create brand
  const [newBrandName, setNewBrandName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit brand
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Feedback notification
  const [feedback, setFeedback] = useState(null);

  const notify = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchBrands();
      if (error) throw error;
      setBrands(data || []);

      // Count products per brand
      const { data: countData } = await supabase
        .from("products")
        .select("product_brand");

      const counts = {};
      countData?.forEach((p) => {
        if (p.product_brand) {
          counts[p.product_brand] = (counts[p.product_brand] || 0) + 1;
        }
      });
      setBrandCounts(counts);
    } catch (err) {
      notify(err.message || "Failed to load brands.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    setIsCreating(true);
    const { data, error } = await createBrand(newBrandName.trim());
    setIsCreating(false);

    if (error) {
      notify(error.message || "Failed to create brand.", "error");
    } else {
      setBrands((prev) => [...prev, data]);
      setNewBrandName("");
      notify(`Brand "${data.brand_name}" added successfully!`);
    }
  };

  const handleStartEdit = (brand) => {
    setEditingId(brand.brand_id);
    setEditName(brand.brand_name);
  };

  const handleSaveEdit = async (brandId) => {
    if (!editName.trim()) return;

    setIsSaving(true);
    const { data, error } = await updateBrand(brandId, editName.trim());
    setIsSaving(false);

    if (error) {
      notify(error.message || "Failed to update brand.", "error");
    } else {
      setBrands((prev) =>
        prev.map((b) => (b.brand_id === brandId ? data : b))
      );
      setEditingId(null);
      notify(`Brand updated to "${data.brand_name}".`);
    }
  };

  const handleDelete = async (brandId, brandName) => {
    if (!window.confirm(`Are you sure you want to delete brand "${brandName}"?`)) {
      return;
    }

    const { error } = await deleteBrand(brandId);
    if (error) {
      notify(error.message, "error");
    } else {
      setBrands((prev) => prev.filter((b) => b.brand_id !== brandId));
      notify(`Brand "${brandName}" deleted successfully.`);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-wider uppercase flex items-center gap-3">
            <Tag className="w-7 h-7 text-[#e5a93b]" />
            Brands Master
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage manufacturers, authorized brand partners, and equipment labels.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#e5a93b]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between shadow-xl transition-all border ${
            feedback.type === "error"
              ? "bg-red-950/80 border-red-800 text-red-200"
              : "bg-[#13151f] border-[#e5a93b]/50 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#e5a93b]" />
            )}
            <span className="font-medium">{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-zinc-500 hover:text-white ml-4">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Add Form & Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Add Brand Card (5 Cols) */}
        <div className="md:col-span-5 bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#e5a93b]" />
            Add New Brand
          </h2>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="e.g. Brembo Racing"
              required
              className="flex-1 px-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2.5 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 shadow-[0_0_15px_rgba(229,169,59,0.25)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isCreating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Search & Metrics (7 Cols) */}
        <div className="md:col-span-7 bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 mr-2">Total Brands:</span>
              <strong className="text-[#e5a93b] font-bold">{brands.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#151722] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                <th className="py-3.5 px-4 w-20">ID</th>
                <th className="py-3.5 px-4">Brand Name</th>
                <th className="py-3.5 px-4">Linked Products</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#e5a93b]" />
                      <span>Loading brands...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    No brands found.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((b) => {
                  const isEditing = editingId === b.brand_id;
                  const count = brandCounts[b.brand_id] || 0;

                  return (
                    <tr key={b.brand_id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-zinc-500">
                        #{b.brand_id}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-white">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-3 py-1.5 bg-[#0a0b10] border border-[#e5a93b] rounded-lg text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(b.brand_id)}
                              disabled={isSaving}
                              className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-400 hover:bg-emerald-900 transition-colors"
                              title="Save changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-display tracking-wide">{b.brand_name}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-[11px]">
                          <Package className="w-3 h-3 text-[#e5a93b]" />
                          {count} {count === 1 ? "product" : "products"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(b)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit brand"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(b.brand_id, b.brand_name)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
