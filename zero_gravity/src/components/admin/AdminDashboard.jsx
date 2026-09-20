import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  LogOut,
  Package,
  Layers,
  Sparkles,
  Tag,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Check,
  X,
  Filter,
  Edit2,
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  fetchProductsAdmin,
  fetchCategories,
  fetchBrands,
  deleteProduct,
  toggleProductField,
  adminLogout,
} from "@/lib/supabase";
import AddProductModal from "./AddProductModal";

export default function AdminDashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Feedback notification
  const [feedback, setFeedback] = useState(null);

  const showNotification = (msg, type = "success") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [prodsRes, catsRes, brandsRes] = await Promise.all([
        fetchProductsAdmin(),
        fetchCategories(),
        fetchBrands(),
      ]);

      if (prodsRes.error) throw prodsRes.error;
      if (catsRes.error) throw catsRes.error;
      if (brandsRes.error) throw brandsRes.error;

      setProducts(prodsRes.data || []);
      setCategories(catsRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (err) {
      showNotification(err.message || "Failed to load database records.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Product "${newProduct.product_name}" added successfully!`);
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    const { error } = await deleteProduct(productId);
    if (error) {
      showNotification(`Failed to delete product: ${error.message}`, "error");
    } else {
      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
      showNotification(`Deleted "${productName}".`);
    }
  };

  const handleToggle = async (productId, field, currentValue) => {
    const nextVal = currentValue === 1 ? 0 : 1;
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.product_id === productId ? { ...p, [field]: nextVal } : p))
    );

    const { error } = await toggleProductField(productId, field, nextVal);
    if (error) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) => (p.product_id === productId ? { ...p, [field]: currentValue } : p))
      );
      showNotification(`Failed to update ${field}: ${error.message}`, "error");
    } else {
      showNotification(`Updated ${field} status.`);
    }
  };

  // Filtered products calculation
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.product_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.product_id) === searchTerm.trim();

    const matchesCategory =
      selectedCategory === "all" || String(p.category_id) === selectedCategory;

    const matchesBrand =
      selectedBrand === "all" || String(p.product_brand) === selectedBrand;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? p.isActive === 1
        : statusFilter === "inactive"
        ? p.isActive === 0
        : statusFilter === "featured"
        ? p.isFeatured === 1
        : statusFilter === "new"
        ? p.isNew === 1
        : true;

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Metrics
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive === 1).length;
  const inStockCount = products.filter((p) => p.isAvailable === 1).length;
  const featuredCount = products.filter((p) => p.isFeatured === 1).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-wider uppercase flex items-center gap-3">
            <Package className="w-7 h-7 text-[#e5a93b]" />
            Products Inventory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your catalog, stock levels, master category & brand associations, and visibility flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title="Refresh inventory"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#e5a93b]" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/add-product"
            className="py-2.5 px-4 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] text-black font-bold rounded-xl text-xs flex items-center gap-2 hover:brightness-110 shadow-[0_0_20px_rgba(229,169,59,0.3)] transition-all cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
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
                <CheckCircle className="w-4 h-4 text-[#e5a93b]" />
              )}
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Total Products
              </span>
              <Package className="w-4 h-4 text-[#e5a93b]" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2 font-display">
              {totalCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Products in database</div>
          </div>

          <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Active Storefront
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-display">
              {activeCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Live in store catalog</div>
          </div>

          <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                In Stock & Available
              </span>
              <Tag className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mt-2 font-display">
              {inStockCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Available for order</div>
          </div>

          <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Featured Gear
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2 font-display">
              {featuredCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Highlighted on homepage</div>
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search & Selects */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#0a0b10] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
              />
            </div>

            {/* Category Filter */}
            <div className="min-w-[150px]">
              <CustomSelect
                size="sm"
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                placeholder="All Categories"
                options={[
                  { value: "all", label: "All Categories" },
                  ...categories.map((c) => ({
                    value: c.category_id,
                    label: c.category_name,
                  })),
                ]}
              />
            </div>

            {/* Brand Filter */}
            <div className="min-w-[140px]">
              <CustomSelect
                size="sm"
                value={selectedBrand}
                onChange={(val) => setSelectedBrand(val)}
                placeholder="All Brands"
                options={[
                  { value: "all", label: "All Brands" },
                  ...brands.map((b) => ({
                    value: b.brand_id,
                    label: b.brand_name,
                  })),
                ]}
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-[140px]">
              <CustomSelect
                size="sm"
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="All Statuses"
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "active", label: "Active Only" },
                  { value: "inactive", label: "Inactive Only" },
                  { value: "featured", label: "Featured Only" },
                  { value: "new", label: "New Arrivals Only" },
                ]}
              />
            </div>
          </div>

          {/* Master & Add Product Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/admin/categories"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              title="Manage Categories"
            >
              <Layers className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span>Categories</span>
              <span className="px-1.5 py-0.5 bg-zinc-800 text-[10px] rounded text-zinc-400 font-bold">
                {categories.length}
              </span>
            </Link>

            <Link
              to="/admin/brands"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              title="Manage Brands"
            >
              <Tag className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span>Brands</span>
              <span className="px-1.5 py-0.5 bg-zinc-800 text-[10px] rounded text-zinc-400 font-bold">
                {brands.length}
              </span>
            </Link>

            <Link
              to="/admin/add-product"
              className="py-2.5 px-4 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] hover:brightness-110 text-black font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(229,169,59,0.25)] transition-all shrink-0 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#151722] text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800">
                  <th className="py-3.5 px-4">Item & Info</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Qty</th>
                  <th className="py-3.5 px-4">isAvailable</th>
                  <th className="py-3.5 px-4">isNew</th>
                  <th className="py-3.5 px-4">isFeatured</th>
                  <th className="py-3.5 px-4">isActive</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#e5a93b]" />
                        <span>Loading inventory from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-8 h-8 text-zinc-700" />
                        <span className="text-zinc-400 font-medium">No products found</span>
                        <p className="text-xs text-zinc-600">
                          Try clearing filters or click "Add New Product" to create one.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const categoryName = p.category_master?.category_name || "Uncategorized";
                    const brandName = p.brand_master?.brand_name || "Standard";

                    return (
                      <tr key={p.product_id} className="hover:bg-zinc-800/30 transition-colors">
                        {/* Image & Product Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                              {p.product_image ? (
                                <img
                                  src={p.product_image}
                                  alt={p.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-zinc-600" />
                              )}
                            </div>
                            <div className="max-w-[180px] sm:max-w-xs truncate">
                              <p className="font-semibold text-white truncate hover:text-[#e5a93b] transition-colors">
                                {p.product_name}
                              </p>
                              <span className="text-[10px] text-zinc-500">
                                ID: #{p.product_id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-medium text-[11px]">
                            {categoryName}
                          </span>
                        </td>

                        {/* Brand */}
                        <td className="py-3 px-4">
                          <span className="text-zinc-300 font-medium">{brandName}</span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <span className="text-white font-bold text-sm">
                            ₹{Number(p.product_price).toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              p.product_qty < 5
                                ? "text-red-400 bg-red-950/40 px-2 py-0.5 rounded"
                                : "text-zinc-300"
                            }`}
                          >
                            {p.product_qty} pcs
                          </span>
                        </td>

                        {/* isAvailable Checkbox Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggle(p.product_id, "isAvailable", p.isAvailable)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              p.isAvailable === 1
                                ? "bg-emerald-950/40 border-emerald-800 text-emerald-300 hover:bg-emerald-900/50"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                            }`}
                          >
                            {p.isAvailable === 1 ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Yes</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 text-zinc-500" />
                                <span>No</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* isNew Checkbox Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggle(p.product_id, "isNew", p.isNew)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              p.isNew === 1
                                ? "bg-cyan-950/40 border-cyan-800 text-cyan-300 hover:bg-cyan-900/50"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                            }`}
                          >
                            {p.isNew === 1 ? (
                              <>
                                <Check className="w-3 h-3 text-cyan-400" />
                                <span>New</span>
                              </>
                            ) : (
                              <span>-</span>
                            )}
                          </button>
                        </td>

                        {/* isFeatured Checkbox Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggle(p.product_id, "isFeatured", p.isFeatured)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              p.isFeatured === 1
                                ? "bg-amber-950/40 border-amber-800 text-amber-300 hover:bg-amber-900/50"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                            }`}
                          >
                            {p.isFeatured === 1 ? (
                              <>
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Featured</span>
                              </>
                            ) : (
                              <span>-</span>
                            )}
                          </button>
                        </td>

                        {/* isActive Checkbox Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggle(p.product_id, "isActive", p.isActive)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              p.isActive === 1
                                ? "bg-[#e5a93b]/20 border-[#e5a93b]/50 text-[#e5a93b] hover:bg-[#e5a93b]/30"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                            }`}
                          >
                            {p.isActive === 1 ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/edit-product/${p.product_id}`}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-[#e5a93b] hover:bg-[#e5a93b]/10 transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.product_id, p.product_name)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Delete product"
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

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        brands={brands}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}
