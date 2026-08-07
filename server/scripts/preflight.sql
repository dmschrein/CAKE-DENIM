-- PREFLIGHT: read-only. Tells you whether the two cake tees can be hard-deleted
-- or must be de-listed. Run this against production FIRST.
--
-- Plain SQL only (no psql meta-commands), so it runs under either:
--   psql "$DATABASE_URL" -f preflight.sql
--   npx prisma db execute --file preflight.sql --schema prisma/schema.prisma

SELECT 'Products'             AS table, count(*) FROM "Products"             WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1')
UNION ALL
SELECT 'ProductCategories',    count(*) FROM "ProductCategories"    WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1')
UNION ALL
SELECT 'ProductSubCategories', count(*) FROM "ProductSubCategories" WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1')
UNION ALL
SELECT 'ProductVariants',      count(*) FROM "ProductVariants"      WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1')
UNION ALL
SELECT 'Reviews',              count(*) FROM "Reviews"              WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1')
UNION ALL
-- THE DECIDING NUMBER. If this is > 0, you cannot hard-delete: real orders
-- reference these products and deleting them would destroy order history.
SELECT 'OrderItems (DECIDES)', count(*) FROM "OrderItems"           WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1')
UNION ALL
SELECT 'CartItems',            count(*) FROM "CartItems" ci
  WHERE ci."variantId" IN (SELECT "variantId" FROM "ProductVariants"
                           WHERE "productId" IN ('cbs4-cd4f2wb0-fb2ws0-pr1d1','emcs5-cd4f5wb0-fb2ws0-pr1d1'));
