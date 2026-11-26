import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  process.env?.VITE_SUPABASE_URL ||
  "https://ibkltivoihhlelfbglet.supabase.co";

const supabaseAnonKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  process.env?.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlia2x0aXZvaWhobGVsZmJnbGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyODE2NzgsImV4cCI6MjEwNDg1NzY3OH0.uyEOKfwOop1_QE3MfKEV1PBk0rQ8C-Zf7VJBhmbTKB4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Login Helper
 * Supports signing in using either an email or a username.
 */
export async function adminLogin(identifier, password) {
  const trimmed = identifier.trim();
  let emailToUse = trimmed;

  if (!trimmed.includes("@")) {
    const { data: email, error: lookupError } = await supabase.rpc(
      "get_admin_email_by_username",
      { p_username: trimmed }
    );

    if (lookupError || !email) {
      return {
        data: null,
        error: lookupError || new Error("Admin username not found or account inactive"),
      };
    }
    emailToUse = email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToUse,
    password,
  });

  return { data, error };
}

/**
 * Admin Logout
 */
export async function adminLogout() {
  return await supabase.auth.signOut();
}

/**
 * Get current active admin session
 */
export async function getCurrentAdmin() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { ...user, profile };
}

// -------------------------------------------------------------
// CATEGORIES (category_master) CRUD
// -------------------------------------------------------------

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("category_master")
    .select("category_id, category_name, created_at")
    .order("category_name");
  return { data: data || [], error };
}

export async function createCategory(category_name) {
  const { data, error } = await supabase
    .from("category_master")
    .insert([{ category_name: category_name.trim() }])
    .select()
    .single();
  return { data, error };
}

export async function updateCategory(category_id, category_name) {
  const { data, error } = await supabase
    .from("category_master")
    .update({ category_name: category_name.trim() })
    .eq("category_id", category_id)
    .select()
    .single();
  return { data, error };
}

export async function deleteCategory(category_id) {
  // Check if any products use this category first
  const { count, error: countErr } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", category_id);

  if (count && count > 0) {
    return {
      error: new Error(`Cannot delete: ${count} product(s) are linked to this category.`),
    };
  }

  const { error } = await supabase
    .from("category_master")
    .delete()
    .eq("category_id", category_id);
  return { error };
}

// -------------------------------------------------------------
// BRANDS (brand_master) CRUD
// -------------------------------------------------------------

export async function fetchBrands() {
  const { data, error } = await supabase
    .from("brand_master")
    .select("brand_id, brand_name, created_at")
    .order("brand_name");
  return { data: data || [], error };
}

export async function createBrand(brand_name) {
  const { data, error } = await supabase
    .from("brand_master")
    .insert([{ brand_name: brand_name.trim() }])
    .select()
    .single();
  return { data, error };
}

export async function updateBrand(brand_id, brand_name) {
  const { data, error } = await supabase
    .from("brand_master")
    .update({ brand_name: brand_name.trim() })
    .eq("brand_id", brand_id)
    .select()
    .single();
  return { data, error };
}

export async function deleteBrand(brand_id) {
  // Check if any products use this brand first
  const { count, error: countErr } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("product_brand", brand_id);

  if (count && count > 0) {
    return {
      error: new Error(`Cannot delete: ${count} product(s) are linked to this brand.`),
    };
  }

  const { error } = await supabase
    .from("brand_master")
    .delete()
    .eq("brand_id", brand_id);
  return { error };
}

// -------------------------------------------------------------
// PRODUCTS CRUD
// -------------------------------------------------------------

const PRODUCT_SELECT_WITH_VARIATIONS = `
  product_id,
  product_name,
  category_id,
  product_brand,
  product_qty,
  product_price,
  product_description,
  product_image,
  product_type,
  variation_attribute,
  "isAvailable",
  "isNew",
  "isFeatured",
  "isActive",
  created_at,
  modified_at,
  category_master ( category_id, category_name ),
  brand_master ( brand_id, brand_name ),
  product_variations (
    variation_id,
    product_id,
    attribute_name,
    variation_name,
    price,
    sale_price,
    stock,
    sort_order,
    is_active
  )
`;

const PRODUCT_SELECT_LEGACY = `
  product_id,
  product_name,
  category_id,
  product_brand,
  product_qty,
  product_price,
  product_description,
  product_image,
  "isAvailable",
  "isNew",
  "isFeatured",
  "isActive",
  created_at,
  modified_at,
  category_master ( category_id, category_name ),
  brand_master ( brand_id, brand_name )
`;

function isMissingVariationSchemaError(error) {
  if (!error) return false;
  const code = String(error.code || "");
  const msg = String(error.message || "").toLowerCase();
  return (
    code === "PGRST200" ||
    code === "PGRST204" ||
    code === "PGRST205" ||
    code === "42703" ||
    code === "42P01" ||
    msg.includes("product_variations") ||
    msg.includes("product_type")
  );
}

function normalizeProductVariations(row) {
  if (!row) return row;
  const sorted = Array.isArray(row.product_variations)
    ? [...row.product_variations]
        .filter((v) => v.is_active !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.variation_id ?? 0) - (b.variation_id ?? 0))
    : [];
  return {
    ...row,
    product_type: row.product_type || (sorted.length > 0 ? "variable" : "simple"),
    product_variations: sorted,
  };
}

export async function fetchPublicProducts() {
  let { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIATIONS)
    .eq("isActive", 1)
    .order("isFeatured", { ascending: false })
    .order("product_id", { ascending: false });

  if (isMissingVariationSchemaError(error)) {
    ({ data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT_LEGACY)
      .eq("isActive", 1)
      .order("isFeatured", { ascending: false })
      .order("product_id", { ascending: false }));
  }

  return { data: (data || []).map(normalizeProductVariations), error };
}

export async function fetchProductsAdmin() {
  let { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIATIONS)
    .order("product_id", { ascending: false });

  if (isMissingVariationSchemaError(error)) {
    ({ data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT_LEGACY)
      .order("product_id", { ascending: false }));
  }

  return { data: (data || []).map(normalizeProductVariations), error };
}

export async function fetchProductById(productId) {
  let { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_WITH_VARIATIONS)
    .eq("product_id", productId)
    .single();

  if (isMissingVariationSchemaError(error)) {
    ({ data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT_LEGACY)
      .eq("product_id", productId)
      .single());
  }

  return { data: normalizeProductVariations(data), error };
}

export async function uploadProductImage(file) {
  try {
    const fileExt = file.name.split(".").pop();
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `product_uploads/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err };
  }
}

export function getEffectiveVariationPrice(v) {
  const sale = v?.sale_price !== null && v?.sale_price !== undefined && v?.sale_price !== ""
    ? Number(v.sale_price)
    : null;
  const reg = Number(v?.price ?? 0);
  if (sale !== null && Number.isFinite(sale) && sale > 0 && sale < reg) {
    return sale;
  }
  return Number.isFinite(reg) ? reg : 0;
}

export function summarizeVariations(variations = []) {
  const valid = variations.filter((v) => String(v.variation_name || "").trim() !== "");
  const totalStock = valid.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);
  const prices = valid.map(getEffectiveVariationPrice).filter((p) => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  return { valid, totalStock, minPrice };
}

async function syncProductVariations(productId, productType, attributeName, variations = []) {
  if (productType !== "variable") {
    const { error: delErr } = await supabase
      .from("product_variations")
      .delete()
      .eq("product_id", productId);
    if (delErr && !isMissingVariationSchemaError(delErr)) {
      return { error: delErr };
    }
    return { error: null };
  }

  // Replace existing variations cleanly in a deterministic order
  const { error: delErr } = await supabase
    .from("product_variations")
    .delete()
    .eq("product_id", productId);

  if (delErr) {
    return { error: delErr };
  }

  const rows = variations
    .filter((v) => String(v.variation_name || "").trim() !== "")
    .map((v, idx) => {
      const regPrice = Number(v.price) || 0;
      const rawSale =
        v.sale_price !== "" && v.sale_price !== null && v.sale_price !== undefined
          ? Number(v.sale_price)
          : null;
      return {
        product_id: Number(productId),
        attribute_name: attributeName || "Size",
        variation_name: String(v.variation_name).trim(),
        price: regPrice,
        sale_price: rawSale !== null && Number.isFinite(rawSale) && rawSale >= 0 ? rawSale : null,
        stock: Math.max(0, parseInt(v.stock, 10) || 0),
        sort_order: idx + 1,
        is_active: true,
      };
    });

  if (rows.length === 0) {
    return { error: null };
  }

  const { error: insErr } = await supabase.from("product_variations").insert(rows);
  return { error: insErr || null };
}

function buildProductPayload(product, includeVariationMeta = true) {
  const isVariable = product.product_type === "variable";
  const { totalStock, minPrice } = summarizeVariations(product.variations || []);

  const base = {
    product_name: product.product_name,
    category_id: Number(product.category_id),
    product_brand: product.product_brand ? Number(product.product_brand) : null,
    product_price: isVariable ? minPrice : Number(product.product_price) || 0,
    product_qty: isVariable ? totalStock : Number(product.product_qty) || 0,
    product_description: product.product_description || "",
    product_image: product.product_image || null,
    isAvailable: product.isAvailable ? 1 : 0,
    isNew: product.isNew ? 1 : 0,
    isFeatured: product.isFeatured ? 1 : 0,
    isActive: product.isActive ? 1 : 0,
  };

  if (includeVariationMeta) {
    base.product_type = isVariable ? "variable" : "simple";
    base.variation_attribute = isVariable ? product.variation_attribute || "Size" : null;
  }
  return base;
}

export async function createProduct(product) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let payload = {
    ...buildProductPayload(product, true),
    created_by: user?.id || null,
  };

  let { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select(PRODUCT_SELECT_LEGACY)
    .single();

  if (isMissingVariationSchemaError(error)) {
    payload = {
      ...buildProductPayload(product, false),
      created_by: user?.id || null,
    };
    ({ data, error } = await supabase
      .from("products")
      .insert([payload])
      .select(PRODUCT_SELECT_LEGACY)
      .single());
  }

  if (error || !data) {
    return { data, error };
  }

  if (product.product_type === "variable") {
    const { error: varErr } = await syncProductVariations(
      data.product_id,
      product.product_type,
      product.variation_attribute || "Size",
      product.variations || []
    );
    if (varErr) {
      return { data: null, error: varErr };
    }
  }

  return await fetchProductById(data.product_id);
}

export async function updateProduct(productId, product) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const timestamp = new Date().toISOString();
  let payload = {
    ...buildProductPayload(product, true),
    modified_by: user?.id || null,
    modified_at: timestamp,
  };

  let { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("product_id", productId)
    .select(PRODUCT_SELECT_LEGACY)
    .single();

  if (isMissingVariationSchemaError(error)) {
    payload = {
      ...buildProductPayload(product, false),
      modified_by: user?.id || null,
      modified_at: timestamp,
    };
    ({ data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("product_id", productId)
      .select(PRODUCT_SELECT_LEGACY)
      .single());
  }

  if (error || !data) {
    return { data, error };
  }

  const { error: varErr } = await syncProductVariations(
    productId,
    product.product_type || "simple",
    product.variation_attribute || "Size",
    product.variations || []
  );
  if (varErr && !isMissingVariationSchemaError(varErr)) {
    return { data: null, error: varErr };
  }

  return await fetchProductById(productId);
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("product_id", productId);
  return { error };
}

export async function toggleProductField(productId, field, nextValue) {
  const { data, error } = await supabase
    .from("products")
    .update({ [field]: nextValue ? 1 : 0, modified_at: new Date().toISOString() })
    .eq("product_id", productId)
    .select();
  return { data, error };
}
