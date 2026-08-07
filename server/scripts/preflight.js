// Read-only preflight for the cake-tee removal, for boxes with no psql client.
// Prints the same numbers as preflight.sql, which `prisma db execute` cannot
// do (it runs a script but discards query output).
//
//   cd server && node scripts/preflight.js
//
// Reads DATABASE_URL from server/.env the same way Prisma does, so it works
// whether or not the variable is exported into the shell.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL not found. Looked in the shell environment and in server/.env"
  );
  process.exit(1);
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TEES = ["cbs4-cd4f2wb0-fb2ws0-pr1d1", "emcs5-cd4f5wb0-fb2ws0-pr1d1"];

async function main() {
  const url = new URL(process.env.DATABASE_URL);
  console.log(`database: ${url.hostname}:${url.port || 5432}${url.pathname}\n`);

  const productVariants = await prisma.productVariants.findMany({
    where: { productId: { in: TEES } },
    select: { variantId: true },
  });
  const variantIds = productVariants.map((v) => v.variantId);

  const counts = {
    Products: await prisma.products.count({
      where: { productId: { in: TEES } },
    }),
    ProductCategories: await prisma.productCategories.count({
      where: { productId: { in: TEES } },
    }),
    ProductSubCategories: await prisma.productSubCategories.count({
      where: { productId: { in: TEES } },
    }),
    ProductVariants: productVariants.length,
    Reviews: await prisma.reviews.count({ where: { productId: { in: TEES } } }),
    "OrderItems (DECIDES)": await prisma.orderItems.count({
      where: { productId: { in: TEES } },
    }),
    CartItems: await prisma.cartItems.count({
      where: { variantId: { in: variantIds } },
    }),
  };

  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k.padEnd(22)} ${v}`);
  }

  console.log(
    counts["OrderItems (DECIDES)"] > 0
      ? "\nOrderItems > 0: these products have been ordered. A hard DELETE would\n" +
          "either be blocked by the foreign key or destroy order history.\n" +
          "Use delist.sql, which leaves orders intact."
      : "\nOrderItems = 0: nothing has been ordered. delist.sql is still the\n" +
          "recommended path (reversible via rollback.sql)."
  );
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
