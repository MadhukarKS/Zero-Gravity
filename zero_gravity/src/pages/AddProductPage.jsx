import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
  Check,
  Sparkles,
  Package,
  Layers,
  Tag,
  AlertCircle,
  CheckCircle2,
  Flame,
  Eye,
  X,
} from "lucide-react";
import {
  getCurrentAdmin,
  supabase,
  fetchCategories,
  fetchBrands,
  uploadProductImage,
  createProduct,
} from "@/lib/supabase";
import AdminLogin from "@/components/admin/AdminLogin";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Master data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Form fields
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("10");
  const [description, setDescription] = useState("");

  // Status checkboxes (1 or 0)
  const [isActive, setIsActive] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Image upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [directImageUrl, setDirectImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminUser = await getCurrentAdmin();
        setUser(adminUser);
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const adminUser = await getCurrentAdmin();
        setUser(adminUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load categories and brands from master tables
  useEffect(() => {
    if (!user) return;
    const loadMasters = async () => {
      setDataLoading(true);
      try {
        const [catsRes, brandsRes] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
        ]);
        if (catsRes.data) setCategories(catsRes.data);
        if (brandsRes.data) setBrands(brandsRes.data);
      } catch (err) {
        console.error("Error loading master data:", err);
      } finally {
        setDataLoading(false);
      }
    };
    loadMasters();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      setErrorMsg("");
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setDirectImageUrl("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }
    if (!categoryId) {
      setErrorMsg("Please select a category.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg("Please enter a valid price greater than 0.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let finalImageUrl = directImageUrl.trim();

      // If user selected a local file, upload to Supabase storage bucket 'products'
      if (selectedFile) {
        const { url, error: uploadErr } = await uploadProductImage(selectedFile);
        if (uploadErr || !url) {
          throw new Error(`Image upload failed: ${uploadErr?.message || "Storage error"}`);
        }
        finalImageUrl = url;
      }

      // Build product payload matching database columns
      const productPayload = {
        product_name: productName.trim(),
        category_id: categoryId,
        product_brand: brandId || null,
        product_price: parseFloat(price),
        product_qty: parseInt(qty, 10) || 0,
        product_description: description.trim(),
        product_image: finalImageUrl || null,
        isAvailable,
        isNew,
        isFeatured,
        isActive,
      };

      const { data, error: insertErr } = await createProduct(productPayload);
      if (insertErr) {
        throw insertErr;
      }

      setSuccessMsg(`Product "${data.product_name}" created successfully! Redirecting...`);
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save product.");
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08090c] flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#e5a93b]" />
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold font-display">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(adminUser) => setUser(adminUser)} />;
  }

  const selectedCategoryName =
    categories.find((c) => String(c.category_id) === String(categoryId))?.category_name ||
    "Category";
  const selectedBrandName =
    brands.find((b) => String(b.brand_id) === String(brandId))?.brand_name ||
    "Zero Gravity";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-wider uppercase flex items-center gap-3">
            <Package className="w-7 h-7 text-[#e5a93b]" />
            Add New Product
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure product details, attach master category & brand, upload media to Supabase storage, and set status flags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors text-xs font-semibold"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] text-black font-bold rounded-xl text-xs transition-all hover:brightness-110 shadow-[0_0_20px_rgba(229,169,59,0.3)] flex items-center gap-2 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save & Publish
              </>
            )}
          </button>
        </div>
      </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Balanced 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Core Product Info & Status Flags (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#e5a93b]" />
                    Product Specifications
                  </h2>
                  <span className="text-[11px] text-zinc-500 font-medium">* Required fields</span>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Product Name <span className="text-[#e5a93b]">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Apex Carbon Pro Helmet"
                    required
                    className="w-full px-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm"
                  />
                </div>

                {/* Category & Brand Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Category <span className="text-[#e5a93b]">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Brand (Optional)
                    </label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm cursor-pointer"
                    >
                      <option value="">Select Brand (Optional)</option>
                      {brands.map((b) => (
                        <option key={b.brand_id} value={b.brand_id}>
                          {b.brand_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Price (₹) <span className="text-[#e5a93b]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        required
                        className="w-full pl-9 pr-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                      Stock Quantity <span className="text-[#e5a93b]">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="0"
                      required
                      className="w-full px-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Product Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Technical specifications, materials, safety ratings, fitment, and features..."
                    className="w-full px-4 py-3 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all text-sm resize-none"
                  />
                </div>
              </div>

              {/* Status & Visibility Flags Card */}
              <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e5a93b]" />
                    Status & Visibility Flags
                  </h2>
                  <span className="text-[11px] text-zinc-500 font-medium">1 = Enabled, 0 = Disabled</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* isActive */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isActive
                        ? "bg-[#e5a93b]/10 border-[#e5a93b]/50 shadow-[0_0_15px_rgba(229,169,59,0.15)]"
                        : "bg-[#0a0b10] border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 accent-[#e5a93b] mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">isActive</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive ? "bg-[#e5a93b] text-black" : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {isActive ? "Active (1)" : "Inactive (0)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Visible and listed in the store catalog.
                      </p>
                    </div>
                  </label>

                  {/* isAvailable */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isAvailable
                        ? "bg-emerald-950/30 border-emerald-700/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-[#0a0b10] border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 accent-[#e5a93b] mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">isAvailable</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isAvailable
                              ? "bg-emerald-500 text-black"
                              : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {isAvailable ? "In Stock (1)" : "Out of Stock (0)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Product is available for immediate purchase.
                      </p>
                    </div>
                  </label>

                  {/* isNew */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isNew
                        ? "bg-cyan-950/30 border-cyan-700/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        : "bg-[#0a0b10] border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 accent-[#e5a93b] mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">isNew</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isNew ? "bg-cyan-400 text-black" : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {isNew ? "New Arrival (1)" : "Standard (0)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Display distinctive 'NEW' arrival badge.
                      </p>
                    </div>
                  </label>

                  {/* isFeatured */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isFeatured
                        ? "bg-amber-950/30 border-amber-700/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "bg-[#0a0b10] border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 accent-[#e5a93b] mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">isFeatured</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isFeatured ? "bg-amber-400 text-black" : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {isFeatured ? "Featured (1)" : "Standard (0)"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Showcase in the featured riders spotlight.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Media Upload & Live Storefront Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Media Card */}
              <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#e5a93b]" />
                    Product Image (Supabase Storage)
                  </h2>
                  <span className="text-[10px] uppercase font-semibold text-[#e5a93b] bg-[#e5a93b]/10 border border-[#e5a93b]/20 px-2 py-0.5 rounded">
                    Bucket: products
                  </span>
                </div>

                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl border border-zinc-700 bg-[#0a0b10] overflow-hidden aspect-video flex items-center justify-center group">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-red-400 hover:text-white hover:bg-red-600 transition-all"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="truncate max-w-[220px]">
                        {selectedFile?.name || "External image preview"}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-400 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-zinc-800 hover:border-[#e5a93b]/60 rounded-2xl p-7 text-center transition-colors bg-[#0a0b10]/40 relative group cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:border-[#e5a93b]/40 group-hover:text-[#e5a93b] transition-all">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-xs">
                          Click to upload product image
                        </p>
                        <p className="text-zinc-500 text-[11px] mt-0.5">
                          or drag & drop here (PNG, JPG, WebP)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* External Image URL input */}
                <div>
                  <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                    Or paste direct external image URL:
                  </label>
                  <input
                    type="url"
                    value={directImageUrl}
                    onChange={(e) => {
                      setDirectImageUrl(e.target.value);
                      if (e.target.value && !selectedFile) {
                        setPreviewUrl(e.target.value);
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#0a0b10] border border-zinc-800 rounded-xl text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
                  />
                </div>
              </div>

              {/* Live Storefront Preview Card */}
              <div className="bg-[#12141c] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#e5a93b]" />
                    Live Customer Storefront Preview
                  </h2>
                  <span className="text-[11px] text-zinc-500 font-medium">Realtime Mock</span>
                </div>

                {/* Mock Card exactly matching Zero Gravity design */}
                <div className="bg-[#0a0b10] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl group max-w-sm mx-auto">
                  <div className="relative aspect-square overflow-hidden bg-black flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Store preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-700 gap-2">
                        <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                        <span className="text-[11px] text-zinc-600 font-medium">
                          No image selected
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-[#e5a93b] text-black text-[10px] font-black tracking-widest px-2.5 py-1 rounded font-display uppercase">
                      {selectedCategoryName}
                    </span>

                    {/* Badges on Top Right */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                      {isNew && (
                        <span className="bg-cyan-400 text-black text-[9px] font-black tracking-widest px-2 py-0.5 rounded font-display uppercase">
                          NEW
                        </span>
                      )}
                      {isFeatured && (
                        <span className="bg-amber-400 text-black text-[9px] font-black tracking-widest px-2 py-0.5 rounded font-display uppercase">
                          FEATURED
                        </span>
                      )}
                      {!isAvailable && (
                        <span className="bg-red-500 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded font-display uppercase">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-semibold text-[#e5a93b] tracking-wider uppercase">
                      {selectedBrandName}
                    </div>
                    <h3 className="font-bold text-white text-sm truncate font-display">
                      {productName.trim() || "Product Title"}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2">
                      {description.trim() || "Product description will appear here in the store..."}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 mt-2">
                      <span className="text-base font-extrabold text-white font-display">
                        ₹{price ? Number(price).toLocaleString("en-IN") : "0"}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {qty} in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Inventory</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800/60 transition-colors text-xs font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] text-black font-bold rounded-xl text-xs transition-all hover:brightness-110 shadow-[0_0_20px_rgba(229,169,59,0.3)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving & Uploading to Supabase...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save & Publish Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
    </div>
  );
}
