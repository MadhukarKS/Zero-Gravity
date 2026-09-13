import React, { useState, useEffect } from "react";
import {
  Layers,
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
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  supabase,
} from "@/lib/supabase";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Create new category state
  const [newCatName, setNewCatName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit category state
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
      const { data, error } = await fetchCategories();
      if (error) throw error;
      setCategories(data || []);

      // Fetch product counts per category
      const { data: countData } = await supabase
        .from("products")
        .select("category_id");
      
      const counts = {};
      countData?.forEach((p) => {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      });
      setCategoryCounts(counts);
    } catch (err) {
      notify(err.message || "Failed to load categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsCreating(true);
    const { data, error } = await createCategory(newCatName.trim());
    setIsCreating(false);

    if (error) {
      notify(error.message || "Failed to create category.", "error");
    } else {
      setCategories((prev) => [...prev, data]);
      setNewCatName("");
      notify(`Category "${data.category_name}" added successfully!`);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.category_id);
    setEditName(cat.category_name);
  };

  const handleSaveEdit = async (catId) => {
    if (!editName.trim()) return;

    setIsSaving(true);
    const { data, error } = await updateCategory(catId, editName.trim());
    setIsSaving(false);

    if (error) {
      notify(error.message || "Failed to update category.", "error");
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.category_id === catId ? data : c))
      );
      setEditingId(null);
      notify(`Category updated to "${data.category_name}".`);
    }
  };

  const handleDelete = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    const { error } = await deleteCategory(catId);
    if (error) {
      notify(error.message, "error");
    } else {
      setCategories((prev) => prev.filter((c) => c.category_id !== catId));
      notify(`Category "${catName}" deleted successfully.`);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-wider uppercase flex items-center gap-3">
            <Layers className="w-7 h-7 text-[#e5a93b]" />
            Categories Master
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage product categories, organize inventory hierarchy, and structure the storefront.
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
        {/* Add Category Card (5 Cols) */}
        <div className="md:col-span-5 bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#e5a93b]" />
            Add New Category
          </h2>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Performance Exhausts"
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
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 mr-2">Total Categories:</span>
              <strong className="text-[#e5a93b] font-bold">{categories.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#151722] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                <th className="py-3.5 px-4 w-20">ID</th>
                <th className="py-3.5 px-4">Category Name</th>
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
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => {
                  const isEditing = editingId === c.category_id;
                  const count = categoryCounts[c.category_id] || 0;

                  return (
                    <tr key={c.category_id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-zinc-500">
                        #{c.category_id}
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
                              onClick={() => handleSaveEdit(c.category_id)}
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
                          <span className="text-sm">{c.category_name}</span>
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
                            onClick={() => handleStartEdit(c)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.category_id, c.category_name)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete category"
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
