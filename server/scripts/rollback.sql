-- ROLLBACK for delist.sql - puts both cake tees back on the storefront.
--
-- Restores the exact category mappings and primaryCategory values that were
-- in production before de-listing (taken from seed data at commit 89701cb).
-- Idempotent: ON CONFLICT DO NOTHING, so re-running is a no-op.
--
-- NOT restored: CartItems that delist.sql cleared. Cart contents are transient
-- and cannot be reconstructed. Nothing else was deleted, so everything else
-- comes straight back.

BEGIN;

INSERT INTO "ProductCategories" ("productId", "categoryId") VALUES
  ('cbs4-cd4f2wb0-fb2ws0-pr1d1',  'tp002'),
  ('cbs4-cd4f2wb0-fb2ws0-pr1d1',  'wm001'),
  ('emcs5-cd4f5wb0-fb2ws0-pr1d1', 'tp002'),
  ('emcs5-cd4f5wb0-fb2ws0-pr1d1', 'ux003')
ON CONFLICT DO NOTHING;

-- Only restores if subcategory sttp002 ("Statement Tees") still exists in the
-- database. If it was removed, this inserts nothing rather than failing.
INSERT INTO "ProductSubCategories" ("productId", "subcategoryId")
SELECT 'cbs4-cd4f2wb0-fb2ws0-pr1d1', 'sttp002'
 WHERE EXISTS (SELECT 1 FROM "SubCategories" WHERE "subcategoryId" = 'sttp002')
ON CONFLICT DO NOTHING;

UPDATE "Products" SET "primaryCategory" = 'Tops'
 WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1');

-- Verify before committing: both should show primaryCategory=Tops, categories=2.
SELECT p."productId", p.name, p."primaryCategory",
       (SELECT count(*) FROM "ProductCategories" c WHERE c."productId" = p."productId") AS categories
  FROM "Products" p
 WHERE p."productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1');

COMMIT;
