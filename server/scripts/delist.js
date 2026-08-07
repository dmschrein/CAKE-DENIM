// De-list the two cake tees from the storefront, using the Prisma client the
// app already has. No psql install required on the server.
//
//   node scripts/delist.js                      DRY RUN - shows what would change, then rolls back
//   node scripts/delist.js --confirm            commits
//   node scripts/delist.js --rollback           DRY RUN of the undo
//   node scripts/delist.js --rollback --confirm undoes it, putting both tees back
//
// Everything runs inside one transaction. Without --confirm the transaction is
// deliberately aborted, so a dry run cannot leave partial state behind.
//
// This removes the products from every listing WITHOUT deleting the product
// rows, so OrderItems, Reviews and all foreign keys stay intact. Reversible
// with rollback.sql. Idempotent.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found in shell environment or server/.env");
  process.exit(1);
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TEES = ["cbs4-cd4f2wb0-fb2ws0-pr1d1", "emcs5-cd4f5wb0-fb2ws0-pr1d1"];
const confirm = process.argv.includes("--confirm");
const rollback = process.argv.includes("--rollback");

// Original category mappings, from seed data at commit 89701cb.
const ORIGINAL_CATEGORIES = [
  ["cbs4-cd4f2wb0-fb2ws0-pr1d1", "tp002"],
  ["cbs4-cd4f2wb0-fb2ws0-pr1d1", "wm001"],
  ["emcs5-cd4f5wb0-fb2ws0-pr1d1", "tp002"],
  ["emcs5-cd4f5wb0-fb2ws0-pr1d1", "ux003"],
];

class DryRun extends Error {}

async function snapshot(tx) {
  return tx.$queryRawUnsafe(`
    SELECT p."productId", p.name, p."primaryCategory",
           (SELECT count(*)::int FROM "ProductCategories" c WHERE c."productId" = p."productId") AS categories,
           (SELECT count(*)::int FROM "ProductSubCategories" s WHERE s."productId" = p."productId") AS subcategories
      FROM "Products" p
     WHERE p."productId" IN ('${TEES[0]}','${TEES[1]}')
     ORDER BY p.name`);
}

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  console.log(`database: ${url.hostname}:${url.port || 5432}${url.pathname}`);
  console.log(`action:   ${rollback ? "ROLLBACK (put the tees back)" : "DE-LIST (remove the tees)"}`);
  console.log(confirm ? "mode:     COMMIT\n" : "mode:     DRY RUN (no changes kept)\n");

  try {
    await prisma.$transaction(async (tx) => {
      console.log("before:");
      console.table(await snapshot(tx));

      if (rollback) {
        const values = ORIGINAL_CATEGORIES.map(([p, c]) => `('${p}','${c}')`).join(",");
        const cats = await tx.$executeRawUnsafe(
          `INSERT INTO "ProductCategories" ("productId","categoryId")
           VALUES ${values} ON CONFLICT DO NOTHING`);
        // Only restorable if the "Statement Tees" subcategory still exists.
        const subs = await tx.$executeRawUnsafe(
          `INSERT INTO "ProductSubCategories" ("productId","subcategoryId")
           SELECT '${TEES[0]}', 'sttp002'
            WHERE EXISTS (SELECT 1 FROM "SubCategories" WHERE "subcategoryId" = 'sttp002')
           ON CONFLICT DO NOTHING`);
        const prim = await tx.$executeRawUnsafe(
          `UPDATE "Products" SET "primaryCategory" = 'Tops' WHERE "productId" IN ('${TEES[0]}','${TEES[1]}')`);

        console.log(
          `\nProductCategories restored:    ${cats}` +
          `\nProductSubCategories restored: ${subs}` +
          `\nprimaryCategory set to Tops:   ${prim}` +
          `\nCartItems:                     not restorable (transient)\n`);
      } else {
        const cats = await tx.$executeRawUnsafe(
          `DELETE FROM "ProductCategories" WHERE "productId" IN ('${TEES[0]}','${TEES[1]}')`);
        const subs = await tx.$executeRawUnsafe(
          `DELETE FROM "ProductSubCategories" WHERE "productId" IN ('${TEES[0]}','${TEES[1]}')`);
        const prim = await tx.$executeRawUnsafe(
          `UPDATE "Products" SET "primaryCategory" = NULL WHERE "productId" IN ('${TEES[0]}','${TEES[1]}')`);
        const carts = await tx.$executeRawUnsafe(
          `DELETE FROM "CartItems" WHERE "variantId" IN (
             SELECT "variantId" FROM "ProductVariants"
              WHERE "productId" IN ('${TEES[0]}','${TEES[1]}'))`);

        console.log(
          `\nProductCategories deleted:    ${cats}` +
          `\nProductSubCategories deleted: ${subs}` +
          `\nprimaryCategory nulled:       ${prim}` +
          `\nCartItems cleared:            ${carts}\n`);
      }

      console.log("after:");
      console.table(await snapshot(tx));

      if (!confirm) throw new DryRun();
    });

    console.log("\nCommitted. Verify with:");
    console.log("  curl -s https://q2nlkv23yh.execute-api.us-west-1.amazonaws.com/prod1/api/products | grep -ci cake");
    console.log(
      rollback
        ? "Expect 2 (both tees back)."
        : "Expect 0. To undo: node scripts/delist.js --rollback --confirm");
  } catch (e) {
    if (e instanceof DryRun) {
      console.log("\nDRY RUN - transaction rolled back, nothing changed.");
      console.log("Re-run with --confirm to apply.");
      return;
    }
    throw e;
  }
}

main()
  .catch((e) => {
    console.error("\nFAILED:", e.message);
    console.error("No partial changes: the transaction was rolled back.");
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
