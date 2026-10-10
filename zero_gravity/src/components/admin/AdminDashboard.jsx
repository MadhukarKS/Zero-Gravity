import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Package,
  Layers,
  Sparkles,
  Tag,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Edit2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  fetchProductsAdmin,
  fetchCategories,
  fetchBrands,
  deleteProduct,
  toggleProductField,
} from "@/lib/supabase";
import AddProductModal from "./AddProductModal";
import ProductDetailsModal from "./ProductDetailsModal";

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

  // Pagination (20 by default)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

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

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, statusFilter]);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Product "${newProduct.product_name}" added successfully!`);
  };

  // Deactivate product (or reactivate) via Delete icon
  const handleDeactivateToggle = async (product) => {
    const isCurrentlyActive = product.isActive === 1;
    const action = isCurrentlyActive ? "deactivate" : "reactivate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${product.product_name}"?`
      )
    ) {
      return;
    }

    const nextVal = isCurrentlyActive ? 0 : 1;

    // Optimistic state update
    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === product.product_id ? { ...p, isActive: nextVal } : p
      )
    );

    if (viewingProduct?.product_id === product.product_id) {
      setViewingProduct((prev) =>
        prev ? { ...prev, isActive: nextVal } : null
      );
    }

    const { error } = await toggleProductField(
      product.product_id,
      "isActive",
      product.isActive
    );

    if (error) {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === product.product_id
            ? { ...p, isActive: product.isActive }
            : p
        )
      );
      if (viewingProduct?.product_id === product.product_id) {
        setViewingProduct((prev) =>
          prev ? { ...prev, isActive: product.isActive } : null
        );
      }
      showNotification(`Failed to ${action} product: ${error.message}`, "error");
    } else {
      showNotification(
        `"${product.product_name}" has been ${
          isCurrentlyActive ? "deactivated" : "reactivated"
        } successfully.`
      );
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
  const inStockCount = products.filter((p) => (Number(p.product_qty) || 0) > 0).length;
  const featuredCount = products.filter((p) => p.isFeatured === 1).length;

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 sm:gap-3">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#e5a93b] shrink-0" />
            <span>Products Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage catalog, stock levels, categories, brands, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-medium"
            title="Refresh inventory"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#e5a93b]" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/add-product"
            className="flex-1 sm:flex-initial justify-center py-2.5 px-4 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-medium rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl text-xs flex items-center justify-between transition-all border ${
            feedback.type === "error"
              ? "bg-red-950/80 border-red-800 text-red-200"
              : "bg-[#141722] border-zinc-700 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#e5a93b] shrink-0" />
            )}
            <span className="truncate">{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-500 hover:text-white ml-2 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Total Products
            </span>
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1.5 sm:mt-2 tracking-tight">
            {totalCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">In database</div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Active Store
            </span>
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1.5 sm:mt-2 tracking-tight">
            {activeCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">Live in catalog</div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-medium">
              In Stock
            </span>
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1.5 sm:mt-2 tracking-tight">
            {inStockCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">Available</div>
        </div>

        <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl p-3.5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Featured
            </span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5a93b]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1.5 sm:mt-2 tracking-tight">
            {featuredCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">On homepage</div>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl p-3.5 sm:p-4 space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
        {/* Search & Selects */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#090a0f] border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] transition-colors"
            />
          </div>

          {/* Select Dropdowns in Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto flex-1">
            {/* Category Filter */}
            <div>
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
            <div>
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
            <div>
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
                  { value: "new", label: "New Arrivals" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Master & Add Product Buttons */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t border-zinc-800/60 lg:border-t-0">
          <Link
            to="/admin/categories"
            className="flex-1 lg:flex-initial py-2 px-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Manage Categories"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Categories</span>
            <span className="px-1.5 py-0.5 bg-zinc-800 text-[10px] rounded text-zinc-400 font-semibold">
              {categories.length}
            </span>
          </Link>

          <Link
            to="/admin/brands"
            className="flex-1 lg:flex-initial py-2 px-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Manage Brands"
          >
            <Tag className="w-3.5 h-3.5 text-zinc-400" />
            <span>Brands</span>
            <span className="px-1.5 py-0.5 bg-zinc-800 text-[10px] rounded text-zinc-400 font-semibold">
              {brands.length}
            </span>
          </Link>

          <Link
            to="/admin/add-product"
            className="py-2 px-3.5 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-medium rounded-xl text-xs hidden lg:flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Product Inventory Section: Responsive Cards on Mobile, Table on Desktop */}
      <div className="bg-[#12141c] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        {/* Mobile View: Clean, Thumb-Friendly Cards (Visible on screens smaller than sm) */}
        <div className="sm:hidden divide-y divide-zinc-800/80">
          {loading ? (
            <div className="py-12 text-center text-zinc-500">
              <RefreshCw className="w-5 h-5 animate-spin text-[#e5a93b] mx-auto mb-2" />
              <span className="text-xs">Loading inventory...</span>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 px-4">
              <Package className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="font-medium text-zinc-400 text-xs">No products found</p>
              <p className="text-[11px] text-zinc-600 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            paginatedProducts.map((p, index) => {
              const serialNo = (currentPage - 1) * pageSize + index + 1;
              const categoryName = p.category_master?.category_name || "Uncategorized";
              const stockQty = Number(p.product_qty || 0);

              return (
                <div key={p.product_id} className="p-3.5 space-y-2.5 hover:bg-zinc-800/30 transition-colors">
                  {/* Top Bar: SL No, Status & Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        #{serialNo}
                      </span>
                      {p.isActive === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingProduct(p)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/admin/edit-product/${p.product_id}`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-[#e5a93b] bg-zinc-900 border border-zinc-800 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeactivateToggle(p)}
                        className={`p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer ${
                          p.isActive === 1 ? "text-zinc-400 hover:text-rose-400" : "text-emerald-400"
                        }`}
                        title={p.isActive === 1 ? "Deactivate" : "Reactivate"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info: Image + Title + Category */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewingProduct(p)}
                      className="w-12 h-12 rounded-xl bg-[#090a0f] border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      {p.product_image ? (
                        <img src={p.product_image} alt={p.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-zinc-600" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => setViewingProduct(p)}
                        className="font-medium text-white text-xs truncate hover:text-[#e5a93b] transition-colors text-left block w-full"
                      >
                        {p.product_name}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                          {categoryName}
                        </span>
                        <span className="text-[10px] text-zinc-500">ID: #{p.product_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Stock Row */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/50 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Price</span>
                      <span className="font-semibold text-white">₹{Number(p.product_price).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 text-[10px] block">Stock</span>
                      {stockQty <= 0 ? (
                        <span className="text-[10px] text-rose-400 font-medium">Out of stock</span>
                      ) : stockQty <= 5 ? (
                        <span className="text-[10px] text-amber-400 font-medium">{stockQty} left (Low)</span>
                      ) : (
                        <span className="text-[10px] text-zinc-300 font-medium">{stockQty} in stock</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop / Tablet View: Table (Visible on sm screens and up) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#151722] text-zinc-400 font-medium border-b border-zinc-800">
                <th className="py-3.5 px-4 font-medium w-16">SL No</th>
                <th className="py-3.5 px-4 font-medium">Product</th>
                <th className="py-3.5 px-4 font-medium">Category</th>
                <th className="py-3.5 px-4 font-medium">Price</th>
                <th className="py-3.5 px-4 font-medium">Stock</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#e5a93b]" />
                      <span>Loading inventory...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-7 h-7 text-zinc-700" />
                      <span className="text-zinc-400 font-medium">No products found</span>
                      <p className="text-xs text-zinc-600">
                        Try adjusting your search filters or click "Add New Product".
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p, index) => {
                  const serialNo = (currentPage - 1) * pageSize + index + 1;
                  const categoryName =
                    p.category_master?.category_name || "Uncategorized";
                  const stockQty = Number(p.product_qty || 0);

                  return (
                    <tr
                      key={p.product_id}
                      className="hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* SL No */}
                      <td className="py-3 px-4 text-zinc-400 font-medium">
                        {serialNo}
                      </td>

                      {/* Product: Thumbnail + Name + ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setViewingProduct(p)}
                            className="w-11 h-11 rounded-lg bg-[#090a0f] border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0 hover:border-zinc-700 transition-colors cursor-pointer"
                            title="View product details"
                          >
                            {p.product_image ? (
                              <img
                                src={p.product_image}
                                alt={p.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-zinc-600" />
                            )}
                          </button>
                          <div className="max-w-[220px] sm:max-w-xs truncate">
                            <button
                              type="button"
                              onClick={() => setViewingProduct(p)}
                              className="font-medium text-white truncate hover:text-[#e5a93b] transition-colors text-left block w-full cursor-pointer"
                              title={p.product_name}
                            >
                              {p.product_name}
                            </button>
                            <span className="text-[11px] text-zinc-500 font-normal">
                              ID: #{p.product_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 font-normal text-[11px] border border-zinc-700/50">
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="text-white font-semibold text-xs sm:text-sm">
                          ₹{Number(p.product_price).toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        {stockQty <= 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Out of stock
                          </span>
                        ) : stockQty <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {stockQty} left (Low)
                          </span>
                        ) : (
                          <span className="text-zinc-300 font-medium text-xs">
                            {stockQty} in stock
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {p.isActive === 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions: Eye, Edit, Delete (Deactivate) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Eye Icon: View all details */}
                          <button
                            type="button"
                            onClick={() => setViewingProduct(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="View product details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Icon */}
                          <Link
                            to={`/admin/edit-product/${p.product_id}`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-[#e5a93b] hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Delete Icon: Deactivate product */}
                          <button
                            type="button"
                            onClick={() => handleDeactivateToggle(p)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              p.isActive === 1
                                ? "text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20"
                                : "text-emerald-400 hover:bg-emerald-950/20"
                            }`}
                            title={
                              p.isActive === 1
                                ? "Deactivate product"
                                : "Reactivate product"
                            }
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
        {filteredProducts.length > 0 && (
          <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 bg-[#151722]/60 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-zinc-400 text-center sm:text-left text-[11px] sm:text-xs">
              Showing{" "}
              <span className="font-semibold text-white">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-white">
                {Math.min(currentPage * pageSize, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {filteredProducts.length}
              </span>{" "}
              products
            </div>

            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 mr-1 sm:mr-2">
                <span className="text-zinc-400 text-[11px]">Show:</span>
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
                  <option value={100}>100</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-medium text-zinc-300 text-[11px] sm:text-xs">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Details Modal (View full info on Eye click) */}
      <ProductDetailsModal
        isOpen={Boolean(viewingProduct)}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onToggleActive={handleDeactivateToggle}
      />

      {/* Add Product Modal fallback */}
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
