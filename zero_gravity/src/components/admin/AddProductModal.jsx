import React, { useState } from "react";
import { X, Upload, Image as ImageIcon, Loader2, Check, Sparkles } from "lucide-react";
import { uploadProductImage, createProduct } from "@/lib/supabase";

export default function AddProductModal({ isOpen, onClose, categories, brands, onProductAdded }) {
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
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setErrorMsg("");
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }
    if (!categoryId) {
      setErrorMsg("Please select a category.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg("Please provide a valid price.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    try {
      let finalImageUrl = directImageUrl.trim();

      // Upload image to Supabase Storage if a local file was chosen
      if (selectedFile) {
        const { url, error: uploadErr } = await uploadProductImage(selectedFile);
        if (uploadErr || !url) {
          throw new Error(`Image upload failed: ${uploadErr?.message || "Unknown error"}`);
        }
        finalImageUrl = url;
      }

      // Create product record in database
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

      // Success
      if (onProductAdded) {
        onProductAdded(data);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to create product.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12141d] border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#151722]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e5a93b]/10 border border-[#e5a93b]/30 flex items-center justify-center text-[#e5a93b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                Add New Product
              </h2>
              <p className="text-xs text-zinc-400">
                Register inventory item and publish to Zero Gravity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {errorMsg}
            </div>
          )}

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
              className="w-full px-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all"
            />
          </div>

          {/* Category & Brand Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Category <span className="text-[#e5a93b]">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all cursor-pointer"
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
                Brand
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all cursor-pointer"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Price (₹) <span className="text-[#e5a93b]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">
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
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all"
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
                className="w-full px-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specifications, features, materials, and fitment..."
              className="w-full px-4 py-2.5 bg-[#0a0b10] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b] focus:ring-1 focus:ring-[#e5a93b] transition-all resize-none"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Product Image (Upload to Supabase Storage)
            </label>

            {previewUrl ? (
              <div className="relative rounded-xl border border-zinc-700 bg-[#0a0b10] p-3 flex items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-800"
                />
                <div className="flex-1">
                  <p className="text-white text-xs font-medium truncate">
                    {selectedFile?.name || "Image preview"}
                  </p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "External URL"}
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-800 hover:border-[#e5a93b]/50 rounded-xl p-6 text-center transition-colors bg-[#0a0b10]/50 relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400">
                    <Upload className="w-5 h-5 text-[#e5a93b]" />
                  </div>
                  <div>
                    <span className="text-[#e5a93b] font-medium text-xs">
                      Click to upload image
                    </span>{" "}
                    <span className="text-zinc-400 text-xs">or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    PNG, JPG, WebP up to 10MB (stored in Supabase 'products' bucket)
                  </p>
                </div>
              </div>
            )}

            {/* Optional fallback direct image URL */}
            <div className="mt-2">
              <input
                type="url"
                value={directImageUrl}
                onChange={(e) => {
                  setDirectImageUrl(e.target.value);
                  if (e.target.value && !selectedFile) {
                    setPreviewUrl(e.target.value);
                  }
                }}
                placeholder="Or paste external image URL..."
                className="w-full px-3 py-1.5 bg-[#0a0b10] border border-zinc-800/70 rounded-lg text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
              />
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Product Visibility & Status Flags
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* isAvailable */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0a0b10] border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-all select-none">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-[#e5a93b]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">isAvailable</span>
                  <span className="text-[10px] text-zinc-500 block">In stock</span>
                </div>
              </label>

              {/* isNew */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0a0b10] border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-all select-none">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-[#e5a93b]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">isNew</span>
                  <span className="text-[10px] text-zinc-500 block">New badge</span>
                </div>
              </label>

              {/* isFeatured */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0a0b10] border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-all select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-[#e5a93b]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">isFeatured</span>
                  <span className="text-[10px] text-zinc-500 block">Showcase item</span>
                </div>
              </label>

              {/* isActive */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0a0b10] border border-zinc-800/80 cursor-pointer hover:border-zinc-700 transition-all select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e5a93b] bg-zinc-900 border-zinc-700 focus:ring-0 focus:ring-offset-0 accent-[#e5a93b]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">isActive</span>
                  <span className="text-[10px] text-zinc-500 block">Live in store</span>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800/60 transition-colors cursor-pointer text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-gradient-to-r from-[#e5a93b] to-[#f5af3f] text-black font-semibold rounded-xl text-xs transition-all hover:brightness-110 shadow-[0_0_15px_rgba(229,169,59,0.25)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving & Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
