import React, { useState } from "react";
import { ShoppingBag, Check, MessageCircle, Shield, PackageX } from "lucide-react";
import { useCart, buildWhatsAppSingleUrl } from "@/lib/cart";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const categoryName =
    product.category_master?.category_name ||
    product.category_name ||
    product.cat ||
    "Gear";

  const brandName =
    product.brand_master?.brand_name ||
    product.brand_name ||
    product.brand ||
    null;

  const numericPrice = Number(product.product_price ?? product.price ?? 0);
  const formattedPrice =
    typeof product.price === "string" && product.price.startsWith("₹")
      ? product.price
      : `₹${numericPrice.toLocaleString("en-IN")}`;

  const isAvailable =
    product.isAvailable !== undefined
      ? Boolean(product.isAvailable)
      : true;
  const inStock = isAvailable && (product.product_qty === undefined || product.product_qty > 0);
  const isLowStock = inStock && product.product_qty !== undefined && product.product_qty > 0 && product.product_qty <= 3;

  const isNew = Boolean(product.isNew);
  const isFeatured = Boolean(product.isFeatured);

  const handleAddToCart = () => {
    if (!inStock) return;

    add({
      id: product.product_id || product.id,
      name: product.product_name || product.name,
      cat: categoryName,
      price: formattedPrice,
      img: product.product_image || product.img,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const whatsappUrl = buildWhatsAppSingleUrl({
    name: product.product_name || product.name,
    cat: categoryName,
    price: formattedPrice,
  });

  return (
    <article className="group flex flex-col rounded-xl bg-[#12141c] border border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden">
      {/* Top Image & Badges Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#090a0f] select-none">
        {product.product_image && !imgError ? (
          <img
            src={product.product_image}
            alt={product.product_name || "Product"}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Normal clean fallback placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0f14] p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-[11px] tracking-wider uppercase font-semibold text-zinc-400">
              Zero Gravity
            </span>
            <span className="text-xs text-zinc-600 mt-0.5">Vault Product</span>
          </div>
        )}

        {/* Top-Left Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/80 text-zinc-200 border border-zinc-700/60">
            {categoryName}
          </span>
        </div>

        {/* Top-Right Status Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
          {isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black">
              New
            </span>
          )}
          {isFeatured && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-200 border border-zinc-700">
              Featured
            </span>
          )}
          {!inStock && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800/60">
              <PackageX className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand Name */}
          {brandName && (
            <div className="text-[11px] tracking-wider uppercase font-semibold text-[#e5a93b] mb-1">
              {brandName}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-base text-white leading-snug line-clamp-1">
            {product.product_name || product.name}
          </h3>

          {/* Description */}
          {product.product_description && (
            <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">
              {product.product_description}
            </p>
          )}
        </div>

        {/* Price & Stock Indicator Row */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium block">Price</span>
            <span className="text-lg font-bold text-white">
              {formattedPrice}
            </span>
          </div>

          <div className="text-right">
            {inStock ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLowStock ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                <span className={isLowStock ? "text-amber-400 text-[11px]" : "text-emerald-400 text-[11px]"}>
                  {isLowStock ? `Only ${product.product_qty} left` : "In Stock"}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[11px]">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              !inStock
                ? "opacity-40 cursor-not-allowed border border-zinc-800 text-zinc-500"
                : added
                ? "bg-emerald-950 border border-emerald-700 text-emerald-300"
                : "border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Cart</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Order Button */}
          <a
            href={inStock ? whatsappUrl : `https://wa.me/917892318639?text=${encodeURIComponent(`Hi Zero Gravity, I want to inquire about availability for: ${product.product_name || product.name}`)}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase bg-[#e5a93b] hover:bg-[#f5af3f] text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{inStock ? "Order" : "Inquire"}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
