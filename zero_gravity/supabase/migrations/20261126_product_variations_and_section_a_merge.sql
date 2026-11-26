-- ============================================================================
-- ZERO GRAVITY: Product Variations Schema + Full Backup + Section A Migration
-- Run this in Supabase SQL Editor (Project: ibkltivoihhlelfbglet)
-- ============================================================================
-- IMPORTANT:
-- 1. Creates a full backup table `public.products_backup_20261126` BEFORE edits.
-- 2. Adds `product_type` & `variation_attribute` to `public.products`.
-- 3. Creates `public.product_variations` with proper FK index & RLS policies.
-- 4. Merges ONLY Section A size-split products (color kept in product_name,
--    one image per product, sizes moved into `product_variations`).
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. BACKUP EXISTING PRODUCTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products_backup_20261126 AS
SELECT * FROM public.products;

-- ----------------------------------------------------------------------------
-- 2. SCHEMA: Add variation support to `products` & create `product_variations`
-- ----------------------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'simple',
  ADD COLUMN IF NOT EXISTS variation_attribute text NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_product_type_check'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_product_type_check
      CHECK (product_type IN ('simple', 'variable'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.product_variations (
  variation_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id bigint NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  attribute_name text NOT NULL DEFAULT 'Size',
  variation_name text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  sale_price numeric(10, 2) NULL CHECK (sale_price IS NULL OR sale_price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  modified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_variations_product_id_idx
  ON public.product_variations (product_id);

CREATE INDEX IF NOT EXISTS products_product_type_idx
  ON public.products (product_type);

-- Enable RLS & expose to Data API roles
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.product_variations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variations TO authenticated;

DROP POLICY IF EXISTS "Public can view active product variations" ON public.product_variations;
CREATE POLICY "Public can view active product variations"
  ON public.product_variations
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can insert product variations" ON public.product_variations;
CREATE POLICY "Admins can insert product variations"
  ON public.product_variations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can update product variations" ON public.product_variations;
CREATE POLICY "Admins can update product variations"
  ON public.product_variations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can delete product variations" ON public.product_variations;
CREATE POLICY "Admins can delete product variations"
  ON public.product_variations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = (SELECT auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- 3. SECTION A DATA MIGRATION (Color in product_name, Variations = Size)
--    Only merges Section A items. Section B & C are left untouched.
--    Idempotent guard: only runs if duplicate IDs still exist.
-- ----------------------------------------------------------------------------

-- Helper: convert a group only if its variations haven't been inserted yet
-- 3.1 Scala Blaze Riding Jacket – Grey Black (keep #117, remove #118,#120,#121,#122)
UPDATE public.products
SET product_name = 'Scala Blaze Riding Jacket – Grey Black',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4849,
    product_qty = 6,
    modified_at = now()
WHERE product_id = 117;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 117, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'S',   4849::numeric, 1, 1),
  ('Size', 'L',   4849::numeric, 1, 2),
  ('Size', 'XL',  4849::numeric, 1, 3),
  ('Size', '2XL', 4849::numeric, 2, 4),
  ('Size', '3XL', 4849::numeric, 1, 5)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 117)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 117);

DELETE FROM public.products WHERE product_id IN (118, 120, 121, 122);

-- 3.2 Scala Blaze Riding Jacket – Neon Grey Black (keep #123, remove #124,#125)
UPDATE public.products
SET product_name = 'Scala Blaze Riding Jacket – Neon Grey Black',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4849,
    product_qty = 4,
    modified_at = now()
WHERE product_id = 123;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 123, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'L',   4849::numeric, 2, 1),
  ('Size', 'XL',  4849::numeric, 1, 2),
  ('Size', '2XL', 4849::numeric, 1, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 123)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 123);

DELETE FROM public.products WHERE product_id IN (124, 125);

-- 3.3 Scala Blaze Riding Jacket – Black Neon (keep #228, remove #229,#230,#231,#232,#233)
UPDATE public.products
SET product_name = 'Scala Blaze Riding Jacket – Black Neon',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4849,
    product_qty = 35,
    modified_at = now()
WHERE product_id = 228;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 228, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'S',   4849::numeric, 3, 1),
  ('Size', 'M',   4849::numeric, 8, 2),
  ('Size', 'L',   4849::numeric, 8, 3),
  ('Size', 'XL',  4849::numeric, 7, 4),
  ('Size', 'XXL', 4849::numeric, 7, 5),
  ('Size', '3XL', 4849::numeric, 2, 6)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 228)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 228);

DELETE FROM public.products WHERE product_id IN (229, 230, 231, 232, 233);

-- 3.4 Scala Blaze Riding Jacket – Red Grey Black (keep #127, remove #128)
UPDATE public.products
SET product_name = 'Scala Blaze Riding Jacket – Red Grey Black',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4849,
    product_qty = 2,
    modified_at = now()
WHERE product_id = 127;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 127, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'S',   4849::numeric, 1, 1),
  ('Size', '3XL', 4849::numeric, 1, 2)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 127)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 127);

DELETE FROM public.products WHERE product_id IN (128);

-- 3.5 Scala Viper Riding Jacket – Grey Black (keep #129, remove #130,#131,#132)
-- Note: #130 (XL, qty 3) and #131 (XL, qty 3) are merged as XL qty 6.
UPDATE public.products
SET product_name = 'Scala Viper Riding Jacket – Grey Black',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 6699,
    product_qty = 9,
    modified_at = now()
WHERE product_id = 129;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 129, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'S',   6699::numeric, 2, 1),
  ('Size', 'XL',  6699::numeric, 6, 2),
  ('Size', '3XL', 6699::numeric, 1, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 129)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 129);

DELETE FROM public.products WHERE product_id IN (130, 131, 132);

-- 3.6 Orazo Picus Trail Velcro Waterproof Motorcycle Riding Boots (keep #137, remove #138,#139,#140)
UPDATE public.products
SET product_name = 'Orazo Picus Trail Velcro Waterproof Motorcycle Riding Boots',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 6499,
    product_qty = 8,
    modified_at = now()
WHERE product_id = 137;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 137, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'UK 8',  6499::numeric, 3, 1),
  ('Size', 'UK 9',  6499::numeric, 2, 2),
  ('Size', 'UK 10', 6499::numeric, 1, 3),
  ('Size', 'UK 11', 6499::numeric, 2, 4)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 137)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 137);

DELETE FROM public.products WHERE product_id IN (138, 139, 140);

-- 3.7 Bison Hunter Motorcycle Riding Boots (keep #146, remove #148,#149)
UPDATE public.products
SET product_name = 'Bison Hunter Motorcycle Riding Boots',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 5590,
    product_qty = 3,
    modified_at = now()
WHERE product_id = 146;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 146, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'UK 9',  5590::numeric, 1, 1),
  ('Size', 'UK 10', 5590::numeric, 1, 2),
  ('Size', 'UK 11', 5590::numeric, 1, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 146)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 146);

DELETE FROM public.products WHERE product_id IN (148, 149);

-- 3.8 Bison Defender Motorcycle Riding Boots (keep #158, remove #160,#161,#162)
UPDATE public.products
SET product_name = 'Bison Defender Motorcycle Riding Boots',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4290,
    product_qty = 5,
    modified_at = now()
WHERE product_id = 158;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 158, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'UK 8',  4290::numeric, 1, 1),
  ('Size', 'UK 9',  4290::numeric, 1, 2),
  ('Size', 'UK 10', 4290::numeric, 1, 3),
  ('Size', 'UK 11', 4290::numeric, 2, 4)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 158)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 158);

DELETE FROM public.products WHERE product_id IN (160, 161, 162);

-- 3.9 Bison Air Pro Level 2 Riding Pants (keep #163, remove #164,#165)
UPDATE public.products
SET product_name = 'Bison Air Pro Level 2 Riding Pants',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 5790,
    product_qty = 215,
    modified_at = now()
WHERE product_id = 163;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 163, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'M',   5790::numeric, 3,   1),
  ('Size', 'XL',  5790::numeric, 210, 2),
  ('Size', '2XL', 5790::numeric, 2,   3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 163)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 163);

DELETE FROM public.products WHERE product_id IN (164, 165);

-- 3.10 Bison Comet Level 2 Riding Jacket – Neon Grey Black (keep #166, remove #168,#169)
UPDATE public.products
SET product_name = 'Bison Comet Level 2 Riding Jacket – Neon Grey Black',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4990,
    product_qty = 5,
    modified_at = now()
WHERE product_id = 166;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 166, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'M',  4990::numeric, 1, 1),
  ('Size', 'L',  4990::numeric, 2, 2),
  ('Size', 'XL', 4990::numeric, 2, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 166)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 166);

DELETE FROM public.products WHERE product_id IN (168, 169);

-- 3.11 Bison Comet Level 2 Riding Jacket – Red Grey Black (keep #167 as variable color product)
UPDATE public.products
SET product_name = 'Bison Comet Level 2 Riding Jacket – Red Grey Black',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4990,
    product_qty = 1,
    modified_at = now()
WHERE product_id = 167;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 167, 'Size', '3XL', 4990::numeric, 1, 1
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 167)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 167);

-- 3.12 Reise Riding Jacket (keep #201, remove #202,#203,#204)
UPDATE public.products
SET product_name = 'Reise Riding Jacket',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 6399,
    product_qty = 7,
    modified_at = now()
WHERE product_id = 201;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 201, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'S',  6399::numeric, 1, 1),
  ('Size', 'M',  6399::numeric, 2, 2),
  ('Size', 'L',  6399::numeric, 2, 3),
  ('Size', 'XL', 6399::numeric, 2, 4)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 201)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 201);

DELETE FROM public.products WHERE product_id IN (202, 203, 204);

-- 3.13 Rhodes – Full Gauntlet Touring Gloves (keep #205, remove #206,#207)
UPDATE public.products
SET product_name = 'Rhodes – Full Gauntlet Touring Gloves',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 4649,
    product_qty = 4,
    modified_at = now()
WHERE product_id = 205;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 205, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'M',  4649::numeric, 1, 1),
  ('Size', 'L',  4649::numeric, 2, 2),
  ('Size', 'XL', 4649::numeric, 1, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 205)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 205);

DELETE FROM public.products WHERE product_id IN (206, 207);

-- 3.14 Zeel JS508 Go Hike Waterproof Raincoat Set (keep #216, remove #217,#218,#219)
UPDATE public.products
SET product_name = 'Zeel JS508 Go Hike Waterproof Raincoat Set',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 1899,
    product_qty = 10,
    modified_at = now()
WHERE product_id = 216;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 216, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'XL',  1899::numeric, 4, 1),
  ('Size', 'XXL', 1899::numeric, 4, 2),
  ('Size', '3XL', 1899::numeric, 1, 3),
  ('Size', '4X',  1899::numeric, 1, 4)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 216)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 216);

DELETE FROM public.products WHERE product_id IN (217, 218, 219);

-- 3.15 Zeel ZE101 Waterproof Raincoat Set – Blue (keep #220, remove #221)
UPDATE public.products
SET product_name = 'Zeel ZE101 Waterproof Raincoat Set – Blue',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 1299,
    product_qty = 3,
    modified_at = now()
WHERE product_id = 220;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 220, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'L',  1299::numeric, 2, 1),
  ('Size', 'XL', 1299::numeric, 1, 2)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 220)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 220);

DELETE FROM public.products WHERE product_id IN (221);

-- 3.16 Zeel ZE101 Waterproof Raincoat Set – Grey (keep #222 as variable color product)
UPDATE public.products
SET product_name = 'Zeel ZE101 Waterproof Raincoat Set – Grey',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 1299,
    product_qty = 1,
    modified_at = now()
WHERE product_id = 222;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 222, 'Size', 'XXL', 1299::numeric, 1, 1
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 222)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 222);

-- 3.17 Scala Hydra-seal Rain Pants Black Neon (keep #224, remove #225,#226,#227)
UPDATE public.products
SET product_name = 'Scala Hydra-seal Rain Pants Black Neon',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 1199,
    product_qty = 10,
    modified_at = now()
WHERE product_id = 224;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 224, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'M',   1199::numeric, 4, 1),
  ('Size', 'L',   1199::numeric, 1, 2),
  ('Size', 'XL',  1199::numeric, 1, 3),
  ('Size', 'XXL', 1199::numeric, 4, 4)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 224)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 224);

DELETE FROM public.products WHERE product_id IN (225, 226, 227);

-- 3.18 Scala Street Level 2 Motorcycle Riding Pants (keep #234, remove #235,#236,#237,#238,#239)
UPDATE public.products
SET product_name = 'Scala Street Level 2 Motorcycle Riding Pants',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 8599,
    product_qty = 8,
    modified_at = now()
WHERE product_id = 234;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 234, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'S',   8599::numeric, 1, 1),
  ('Size', 'M',   8599::numeric, 1, 2),
  ('Size', 'L',   8599::numeric, 1, 3),
  ('Size', 'XL',  8599::numeric, 2, 4),
  ('Size', '2XL', 8599::numeric, 2, 5),
  ('Size', '3XL', 8599::numeric, 1, 6)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 234)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 234);

DELETE FROM public.products WHERE product_id IN (235, 236, 237, 238, 239);

-- 3.19 VIATERRA Miller Urban Riding Gloves (keep #260, remove #261,#262)
UPDATE public.products
SET product_name = 'VIATERRA Miller Urban Riding Gloves',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 2449,
    product_qty = 3,
    modified_at = now()
WHERE product_id = 260;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 260, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'M',  2449::numeric, 1, 1),
  ('Size', 'L',  2449::numeric, 1, 2),
  ('Size', 'XL', 2449::numeric, 1, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 260)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 260);

DELETE FROM public.products WHERE product_id IN (261, 262);

-- 3.20 VIATERRA Fender Daily Use Motorcycle Riding Gloves (keep #263, remove #264,#265)
UPDATE public.products
SET product_name = 'VIATERRA Fender Daily Use Motorcycle Riding Gloves',
    product_type = 'variable',
    variation_attribute = 'Size',
    product_price = 1749,
    product_qty = 4,
    modified_at = now()
WHERE product_id = 263;

INSERT INTO public.product_variations (product_id, attribute_name, variation_name, price, stock, sort_order)
SELECT 263, v.attribute_name, v.variation_name, v.price, v.stock, v.sort_order
FROM (VALUES
  ('Size', 'M',  1749::numeric, 1, 1),
  ('Size', 'L',  1749::numeric, 2, 2),
  ('Size', 'XL', 1749::numeric, 1, 3)
) AS v(attribute_name, variation_name, price, stock, sort_order)
WHERE EXISTS (SELECT 1 FROM public.products WHERE product_id = 263)
  AND NOT EXISTS (SELECT 1 FROM public.product_variations WHERE product_id = 263);

DELETE FROM public.products WHERE product_id IN (264, 265);

COMMIT;
