import { Link } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { fetchPublicProducts, fetchCategories, fetchBrands } from "@/lib/supabase";
import { Search, ChevronDown, Check, PackageOpen, RotateCcw, MessageCircle, Wrench, AlertCircle, Layers, Tag } from "lucide-react";

function CustomDropdown({ value, onChange, options, placeholder = "Select...", icon: Icon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(
    (o) => String(o.value).toLowerCase() === String(value).toLowerCase()
  );
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full bg-[#12141c] border ${
          open ? "border-[#e5a93b]" : "border-zinc-800 hover:border-zinc-700"
        } text-white text-sm rounded-xl px-4 py-3 flex items-center justify-between outline-none cursor-pointer transition-colors text-left select-none`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon className="w-4 h-4 text-zinc-500 shrink-0" />}
          <span className={value !== "all" ? "text-white font-medium" : "text-zinc-300"}>
            {displayLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${
            open ? "rotate-180 text-[#e5a93b]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#12141c] border border-zinc-800 rounded-xl shadow-2xl py-1.5 max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = String(opt.value).toLowerCase() === String(value).toLowerCase();
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#e5a93b]/15 text-[#e5a93b] font-medium"
                    : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#e5a93b] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Accessories() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        fetchPublicProducts(),
        fetchCategories(),
        fetchBrands(),
      ]);

      if (prodRes.error) {
        console.error("Failed to load products:", prodRes.error);
        setError("Unable to load products from the database.");
      } else {
        setProducts(prodRes.data || []);
      }

      // Collect categories: from category_master + any categories present in products
      const dbCategories = catRes.data || [];
      const seenCatNames = new Set(dbCategories.map((c) => c.category_name.toLowerCase()));
      const extraCats = [];
      (prodRes.data || []).forEach((p) => {
        const name = p.category_master?.category_name;
        if (name && !seenCatNames.has(name.toLowerCase())) {
          seenCatNames.add(name.toLowerCase());
          extraCats.push({ category_id: p.category_id || name, category_name: name });
        }
      });
      setCategories([...dbCategories, ...extraCats]);

      // Collect brands: from brand_master + any brands present in products
      const dbBrands = brandRes.data || [];
      const seenBrandNames = new Set(dbBrands.map((b) => b.brand_name.toLowerCase()));
      const extraBrands = [];
      (prodRes.data || []).forEach((p) => {
        const name = p.brand_master?.brand_name;
        if (name && !seenBrandNames.has(name.toLowerCase())) {
          seenBrandNames.add(name.toLowerCase());
          extraBrands.push({ brand_id: p.product_brand || name, brand_name: name });
        }
      });
      setBrands([...dbBrands, ...extraBrands]);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryOptions = useMemo(() => [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c.category_name, label: c.category_name }))
  ], [categories]);

  const brandOptions = useMemo(() => [
    { value: "all", label: "All Brands" },
    ...brands.map((b) => ({ value: b.brand_name, label: b.brand_name }))
  ], [brands]);

  const items = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const pCatName = p.category_master?.category_name || p.cat || "";
      const pCatId = p.category_id;
      const matchesCat =
        selectedCategory === "all" ||
        String(pCatId) === String(selectedCategory) ||
        pCatName.toLowerCase() === selectedCategory.toLowerCase();

      // Brand filter
      const pBrandName = p.brand_master?.brand_name || "";
      const pBrandId = p.product_brand;
      const matchesBrand =
        selectedBrand === "all" ||
        String(pBrandId) === String(selectedBrand) ||
        pBrandName.toLowerCase() === selectedBrand.toLowerCase();

      // Search query
      const query = q.trim().toLowerCase();
      const pName = p.product_name || p.name || "";
      const pDesc = p.product_description || "";
      const matchesSearch =
        query === "" ||
        pName.toLowerCase().includes(query) ||
        pBrandName.toLowerCase().includes(query) ||
        pCatName.toLowerCase().includes(query) ||
        pDesc.toLowerCase().includes(query);

      return matchesCat && matchesBrand && matchesSearch;
    });
  }, [products, selectedCategory, selectedBrand, q]);

  const hasActiveFilters = selectedCategory !== "all" || selectedBrand !== "all" || q.trim() !== "";

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setQ("");
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col">
      <Nav />

      {/* Header & Clean Filter Bar */}
      <section className="relative pt-32 pb-12 px-6 border-b border-zinc-800 bg-[#0c0d12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-yellow text-xs tracking-widest uppercase mb-3 font-semibold">
            — Store Inventory —
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight">
            The <span className="text-[#e5a93b]">Accessories</span> Vault
          </h1>
          <p className="mt-3 text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Browse our curated collection of factory-spec riding gear, track-tested helmets, exhausts, and performance accessories.
          </p>

          {/* Search Bar + Styled Category Dropdown + Styled Brand Dropdown */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 max-w-5xl">
            {/* Search Input */}
            <div className="lg:col-span-6 relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search accessories, gear, models…"
                className="w-full bg-[#12141c] border border-zinc-800 focus:border-[#e5a93b] text-white text-sm rounded-xl pl-10 pr-9 py-3 outline-none transition-colors placeholder:text-zinc-500"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Styled Category Dropdown */}
            <div className="lg:col-span-3">
              <CustomDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                placeholder="All Categories"
                icon={Layers}
              />
            </div>

            {/* Styled Brand Dropdown */}
            <div className="lg:col-span-3">
              <CustomDropdown
                value={selectedBrand}
                onChange={setSelectedBrand}
                options={brandOptions}
                placeholder="All Brands"
                icon={Tag}
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-zinc-500">Filters:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-red-400 cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedBrand !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                  Brand: {selectedBrand}
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className="hover:text-red-400 cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              {q.trim() && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
                  Search: &quot;{q}&quot;
                  <button
                    onClick={() => setQ("")}
                    className="hover:text-red-400 cursor-pointer ml-1"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#e5a93b] hover:underline cursor-pointer font-medium ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 px-6 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header count info */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              {loading ? "Loading products…" : `${items.length} ${items.length === 1 ? "Product" : "Products"} Found`}
            </span>
            <Link
              to="/cart"
              className="text-xs uppercase tracking-wider text-[#e5a93b] hover:underline font-semibold"
            >
              View Cart →
            </Link>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#12141c] border border-zinc-800 overflow-hidden animate-pulse flex flex-col"
                >
                  <div className="aspect-square bg-zinc-800/50 w-full" />
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="h-3 w-1/3 bg-zinc-800 rounded" />
                    <div className="h-5 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-4 w-full bg-zinc-800/60 rounded mt-1" />
                    <div className="h-6 w-1/2 bg-zinc-800 rounded mt-3" />
                    <div className="grid grid-cols-2 gap-2 pt-2 mt-auto">
                      <div className="h-9 bg-zinc-800 rounded-lg" />
                      <div className="h-9 bg-zinc-800 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-xl bg-[#12141c] border border-zinc-800 p-10 text-center max-w-md mx-auto my-12">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white mb-2">Error Loading Products</h3>
              <p className="text-zinc-400 text-sm mb-5">{error}</p>
              <button
                onClick={loadData}
                className="btn-yellow inline-flex items-center gap-2 cursor-pointer text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Empty Database State (0 products total in DB) */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl bg-[#11131a] border border-zinc-800 p-12 text-center max-w-xl mx-auto my-12">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-5">
                <PackageOpen className="w-8 h-8 text-zinc-400" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-2">
                The Vault is Currently Empty
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
                No products have been added to the database yet. Check back soon for new arrivals or contact us directly on WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/917892318639?text=Hi%20Zero%20Gravity,%20I'm%20looking%20for%20riding%20gear%20and%20accessories.%20Can%20you%20share%20current%20availability?"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-yellow text-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
                <Link
                  to="/book-service"
                  className="btn-ghost-yellow text-xs"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Book Custom Build</span>
                </Link>
              </div>
            </div>
          )}

          {/* Filter Empty State (Products exist in DB, but active search/filter returned 0) */}
          {!loading && !error && products.length > 0 && items.length === 0 && (
            <div className="rounded-xl bg-[#12141c] border border-zinc-800 p-10 text-center max-w-md mx-auto my-12">
              <Search className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-white mb-2">No Matching Products</h3>
              <p className="text-zinc-400 text-sm mb-6">
                No products found matching your current search or filter criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="btn-yellow inline-flex items-center gap-2 cursor-pointer text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

          {/* Active Products Grid */}
          {!loading && !error && items.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((prod) => (
                <ProductCard key={prod.product_id || prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
