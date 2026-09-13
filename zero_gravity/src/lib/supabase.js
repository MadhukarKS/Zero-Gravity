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

export async function fetchProductsAdmin() {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
      category_master ( category_name ),
      brand_master ( brand_name )
    `)
    .order("product_id", { ascending: false });

  return { data: data || [], error };
}

export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
      category_master ( category_name ),
      brand_master ( brand_name )
    `)
    .eq("product_id", productId)
    .single();

  return { data, error };
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

export async function createProduct(product) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload = {
    product_name: product.product_name,
    category_id: Number(product.category_id),
    product_brand: product.product_brand ? Number(product.product_brand) : null,
    product_price: Number(product.product_price) || 0,
    product_qty: Number(product.product_qty) || 0,
    product_description: product.product_description || "",
    product_image: product.product_image || null,
    isAvailable: product.isAvailable ? 1 : 0,
    isNew: product.isNew ? 1 : 0,
    isFeatured: product.isFeatured ? 1 : 0,
    isActive: product.isActive ? 1 : 0,
    created_by: user?.id || null,
  };

  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select(`
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
      category_master ( category_name ),
      brand_master ( brand_name )
    `)
    .single();

  return { data, error };
}

export async function updateProduct(productId, product) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload = {
    product_name: product.product_name,
    category_id: Number(product.category_id),
    product_brand: product.product_brand ? Number(product.product_brand) : null,
    product_price: Number(product.product_price) || 0,
    product_qty: Number(product.product_qty) || 0,
    product_description: product.product_description || "",
    product_image: product.product_image || null,
    isAvailable: product.isAvailable ? 1 : 0,
    isNew: product.isNew ? 1 : 0,
    isFeatured: product.isFeatured ? 1 : 0,
    isActive: product.isActive ? 1 : 0,
    modified_by: user?.id || null,
    modified_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("product_id", productId)
    .select(`
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
      category_master ( category_name ),
      brand_master ( brand_name )
    `)
    .single();

  return { data, error };
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
