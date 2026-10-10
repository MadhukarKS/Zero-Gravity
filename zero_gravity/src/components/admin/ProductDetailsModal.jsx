import React from "react";
import { Link } from "react-router-dom";
import {
  X,
  Package,
  ExternalLink,
  Edit2,
  CheckCircle2,
  XCircle,
  Tag,
  Layers,
  Sparkles,
  Flame,
  Calendar,
  AlertTriangle,
  Clock,
  Eye,
  Power,
} from "lucide-react";

export default function ProductDetailsModal({
  isOpen,
  product,
  onClose,
  onToggleActive,
}) {
  if (!isOpen || !product) return null;

  const categoryName = product.category_master?.category_name || "Uncategorized";
  const brandName = product.brand_master?.brand_name || "Standard";
  const formattedPrice = Number(product.product_price || 0).toLocaleString("en-IN");
  const qty = Number(product.product_qty || 0);

  const getStockBadge = () => {
    if (qty <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Out of Stock (0)
        </span>
      );
    }
    if (qty <= 5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Low Stock ({qty} pcs)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        In Stock ({qty} pcs)
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#12141c] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#151722]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
              <Package className="w-4 h-4 text-[#e5a93b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  Product Details
                </h2>
                <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/60">
                  ID: #{product.product_id}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                Complete overview of inventory item specifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Top Overview: Image + Main Meta */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Image Preview */}
            <div className="w-full sm:w-40 sm:h-40 rounded-xl bg-[#090a0f] border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
              {product.product_image ? (
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                  <Package className="w-8 h-8" />
                  <span className="text-[11px]">No Image</span>
                </div>
              )}
            </div>

            {/* Title & Core Badges */}
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {product.product_name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    <Layers className="w-3 h-3 text-[#e5a93b]" />
                    {categoryName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                    <Tag className="w-3 h-3 text-zinc-400" />
                    {brandName}
                  </span>
                  {getStockBadge()}
                </div>
              </div>

              {/* Price & Status Highlight */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-[11px] font-medium text-zinc-400 block">
                    Catalog Price
                  </span>
                  <span className="text-xl font-bold text-white tracking-tight mt-0.5 block">
                    ₹{formattedPrice}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className="text-[11px] font-medium text-zinc-400 block">
                    Visibility Status
                  </span>
                  <div className="mt-1">
                    {product.isActive === 1 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Active on Store
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-zinc-500" />
                        Deactivated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visibility & Attribute Flags */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 space-y-3">
            <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
              Product Flags & Badges
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  product.isActive === 1
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"
                }`}
              >
                {product.isActive === 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className="font-medium">
                  {product.isActive === 1 ? "Active" : "Inactive"}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  product.isAvailable === 1
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                    : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"
                }`}
              >
                {product.isAvailable === 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className="font-medium">
                  {product.isAvailable === 1 ? "Store Available" : "Unavailable"}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  product.isNew === 1
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                    : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"
                }`}
              >
                {product.isNew === 1 ? (
                  <Flame className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className="font-medium">
                  {product.isNew === 1 ? "New Arrival" : "Standard Item"}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  product.isFeatured === 1
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                    : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"
                }`}
              >
                {product.isFeatured === 1 ? (
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className="font-medium">
                  {product.isFeatured === 1 ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
              Description
            </span>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 text-xs text-zinc-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
              {product.product_description?.trim() || (
                <span className="text-zinc-500 italic">No description provided for this product.</span>
              )}
            </div>
          </div>

          {/* Variations if applicable */}
          {product.product_variations && product.product_variations.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
                Product Variations ({product.product_variations.length})
              </span>
              <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
                {product.product_variations.map((v, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/40 flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{v.variation_name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-300 font-semibold">
                        ₹{Number(v.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-zinc-400">{v.stock} in stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-500 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {formatDate(product.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last Modified: {formatDate(product.modified_at || product.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-t border-zinc-800/80 bg-[#151722]/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          {/* Deactivate / Reactivate button */}
          <button
            type="button"
            onClick={() => onToggleActive(product)}
            className={`w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              product.isActive === 1
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{product.isActive === 1 ? "Deactivate Product" : "Reactivate Product"}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors text-xs font-medium cursor-pointer text-center"
            >
              Close
            </button>

            <Link
              to={`/admin/edit-product/${product.product_id}`}
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-medium rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer text-center"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Product</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
