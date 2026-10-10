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
  Package,
  ChevronLeft,
  ChevronRight,
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

  // Pagination (20 by default)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#e5a93b]" />
            Categories Master
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage product categories, organize inventory hierarchy, and structure the storefront.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-medium self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#e5a93b]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between transition-all border ${
            feedback.type === "error"
              ? "bg-red-950/80 border-red-800 text-red-200"
              : "bg-[#141722] border-zinc-700 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#e5a93b]" />
            <span>{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-500 hover:text-white ml-4"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Controls Bar: Add & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Create Category Form (5 Cols) */}
        <div className="md:col-span-5 bg-[#12141c] border border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-3">
          <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
            Add New Category
          </span>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Performance Exhausts"
              required
              className="flex-1 px-4 py-2.5 bg-[#090a0f] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] transition-colors"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2.5 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isCreating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Search & Metrics (7 Cols) */}
        <div className="md:col-span-7 bg-[#12141c] border border-zinc-800/80 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#090a0f] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 mr-2">Total:</span>
              <strong className="text-white font-semibold">{categories.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#151722] text-zinc-400 font-medium border-b border-zinc-800">
                <th className="py-3.5 px-4 w-16 font-medium">SL No</th>
                <th className="py-3.5 px-4 font-medium">Category Name</th>
                <th className="py-3.5 px-4 font-medium">Linked Products</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#e5a93b]" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((c, index) => {
                  const isEditing = editingId === c.category_id;
                  const count = categoryCounts[c.category_id] || 0;
                  const serialNo = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <tr key={c.category_id} className="hover:bg-zinc-800/30 transition-colors">
                      {/* SL No */}
                      <td className="py-3.5 px-4 font-medium text-zinc-400">
                        {serialNo}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-3 py-1.5 bg-[#090a0f] border border-[#e5a93b] rounded-lg text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(c.category_id)}
                              disabled={isSaving}
                              className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-400 hover:bg-emerald-900 transition-colors cursor-pointer"
                              title="Save changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm">{c.category_name}</span>
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

        {/* Table Pagination Bar */}
        {filteredCategories.length > 0 && (
          <div className="px-4 py-3.5 bg-[#151722]/60 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-zinc-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-white">
                {Math.min(currentPage * pageSize, filteredCategories.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {filteredCategories.length}
              </span>{" "}
              categories
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-zinc-400">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-[#090a0f] border border-zinc-800 rounded-lg text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-medium text-zinc-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
