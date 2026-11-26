import React from "react";
import { Plus, Trash2, Layers } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

const ATTRIBUTE_OPTIONS = [
  { value: "Size", label: "Size" },
  { value: "Color", label: "Color" },
  { value: "Weight", label: "Weight" },
  { value: "Material", label: "Material" },
];

const QUICK_PRESETS = {
  Size: ["S", "M", "L", "XL", "XXL"],
};

/**
 * Shared editor for Variable Product variations (Attribute selector + rows with
 * Variation Name, Stock, Regular Price, Sale Price, and Remove button).
 */
export default function ProductVariationsEditor({
  attributeName,
  onAttributeChange,
  variations,
  onChange,
  compact = false,
}) {
  const handleAddRow = () => {
    onChange([
      ...variations,
      {
        variation_name: "",
        stock: "1",
        price: "",
        sale_price: "",
      },
    ]);
  };

  const handleApplyPreset = (presetValues) => {
    const existing = new Set(
      variations.map((v) => v.variation_name.trim().toLowerCase())
    );
    const basePrice = variations.find((v) => v.price)?.price || "";
    const additions = presetValues
      .filter((val) => !existing.has(val.toLowerCase()))
      .map((val) => ({
        variation_name: val,
        stock: "1",
        price: basePrice,
        sale_price: "",
      }));
    if (additions.length > 0) {
      const cleaned = variations.filter(
        (v) => v.variation_name.trim() !== "" || v.price !== ""
      );
      onChange([...cleaned, ...additions]);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updated = variations.map((row, idx) =>
      idx === index ? { ...row, [field]: value } : row
    );
    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    if (variations.length <= 1) {
      onChange([{ variation_name: "", stock: "1", price: "", sale_price: "" }]);
      return;
    }
    onChange(variations.filter((_, idx) => idx !== index));
  };

  const namePlaceholder =
    attributeName === "Size"
      ? "e.g. M, L, XL or UK 9"
      : attributeName === "Weight"
      ? "e.g. 500g, 1kg"
      : attributeName === "Color"
      ? "e.g. Matte Black"
      : "e.g. Stainless Steel";

  return (
    <div
      className={`bg-[#12141c] border border-zinc-800/80 rounded-2xl ${
        compact ? "p-4 space-y-3.5" : "p-6 space-y-4 shadow-xl"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#e5a93b]" />
          Product Variations
        </h2>
        {QUICK_PRESETS[attributeName] && (
          <button
            type="button"
            onClick={() => handleApplyPreset(QUICK_PRESETS[attributeName])}
            className="text-[11px] font-medium text-[#e5a93b] hover:underline cursor-pointer"
          >
            + Quick Fill S–XXL
          </button>
        )}
      </div>

      {/* Attribute Selector + Add Variation Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="w-full sm:w-52">
          <CustomSelect
            size={compact ? "sm" : "md"}
            value={attributeName}
            onChange={(val) => onAttributeChange(val)}
            options={ATTRIBUTE_OPTIONS}
            placeholder="Select Attribute"
          />
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="px-4 py-2.5 bg-[#e5a93b] hover:bg-[#d4972e] text-zinc-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variation</span>
        </button>
      </div>

      {/* Header Labels (Desktop) */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-2.5 px-3 pt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        <div className="col-span-4">Variation Name *</div>
        <div className="col-span-2">Stock *</div>
        <div className="col-span-2">Reg Price (₹) *</div>
        <div className="col-span-3">Sale Price (₹)</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      {/* Variation Rows */}
      <div className="space-y-2.5">
        {variations.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-[#0a0b10] border border-zinc-800/90 items-center"
          >
            <div className="sm:col-span-4">
              <label className="sm:hidden block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Variation Name *
              </label>
              <input
                type="text"
                value={row.variation_name}
                onChange={(e) =>
                  handleFieldChange(idx, "variation_name", e.target.value)
                }
                placeholder={namePlaceholder}
                className="w-full px-3 py-2 bg-[#12141c] border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="sm:hidden block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={row.stock}
                onChange={(e) => handleFieldChange(idx, "stock", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-[#12141c] border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="sm:hidden block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Reg Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={row.price}
                onChange={(e) => handleFieldChange(idx, "price", e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-[#12141c] border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="sm:hidden block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                Sale Price (₹) (Optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={row.sale_price ?? ""}
                onChange={(e) =>
                  handleFieldChange(idx, "sale_price", e.target.value)
                }
                placeholder="Optional"
                className="w-full px-3 py-2 bg-[#12141c] border border-zinc-800 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e5a93b]"
              />
            </div>

            <div className="sm:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => handleRemoveRow(idx)}
                className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Remove variation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
