-- DE-LIST the two cake tees from the storefront.
--
-- Safe to run whether or not the products have been ordered: it removes them
-- from every listing without deleting the product rows, so OrderItems, Reviews
-- and all foreign keys stay intact. Idempotent - re-running is a no-op.
--
-- Why this works: getProducts() filters on `Categories: { some: ... }`, so a
-- product with zero ProductCategories rows can never match /api/products or
-- /shopAll. getProductsByPrimaryCategory() filters on Products.primaryCategory,
-- so nulling it removes the product from /collection/Tops.
--
-- Note: /api/products/:productId still resolves by direct link. That is
-- deliberate - it keeps order-confirmation and receipt pages working.

BEGIN;

DELETE FROM "ProductCategories"
 WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1');

DELETE FROM "ProductSubCategories"
 WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1');

UPDATE "Products" SET "primaryCategory" = NULL
 WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1');

-- Drop them from any live shopping cart so nobody checks out mid-removal.
DELETE FROM "CartItems"
 WHERE "variantId" IN (SELECT "variantId" FROM "ProductVariants"
                       WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1'));

-- Verify before committing: both rows should show 0 categories and NULL primary.
SELECT p."productId", p.name, p."primaryCategory",
       (SELECT count(*) FROM "ProductCategories" c WHERE c."productId" = p."productId") AS categories
  FROM "Products" p
 WHERE p."productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1');

COMMIT;
