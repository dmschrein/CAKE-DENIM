import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData() {
  await prisma.cartItems.deleteMany({});
  await prisma.orderItems.deleteMany({});
  await prisma.productSubCategories.deleteMany({});
  await prisma.productCategories.deleteMany({});
  await prisma.carts.deleteMany({});
  await prisma.orders.deleteMany({});
  await prisma.shippingInfo.deleteMany({});
  await prisma.billingInfo.deleteMany({});
  await prisma.productVariants.deleteMany({});
  await prisma.subCategories.deleteMany({});
  await prisma.categories.deleteMany({});
  await prisma.variants.deleteMany({});
  await prisma.reviews.deleteMany({});
  await prisma.products.deleteMany({});
  await prisma.users.deleteMany({});
  console.log("All data cleared.");
}

async function seedModel(
  filePath: string,
  model: any,
  transformData?: (data: any) => any
) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  for (const item of data) {
    try {
      const finalData = transformData ? transformData(item) : item;
      await model.create({ data: finalData });
    } catch (error) {
      console.error(`Error seeding ${model.name}:`, error);
    }
  }
}

async function main() {
  const seedDataPath = path.join(__dirname, "seedData");

  await deleteAllData();

  console.log("Seeding Users...");
  await seedModel(path.join(seedDataPath, "users.json"), prisma.users);

  console.log("Seeding Categories...");
  await seedModel(
    path.join(seedDataPath, "categories.json"),
    prisma.categories
  );

  console.log("Seeding SubCategories...");
  await seedModel(
    path.join(seedDataPath, "subCategories.json"),
    prisma.subCategories
  );

  console.log("Seeding Products...");
  await seedModel(path.join(seedDataPath, "products.json"), prisma.products);

  console.log("Seeding ProductCategories...");
  await seedModel(
    path.join(seedDataPath, "productCategories.json"),
    prisma.productCategories
  );

  console.log("Seeding ProductSubCategories...");
  await seedModel(
    path.join(seedDataPath, "productSubCategories.json"),
    prisma.productSubCategories
  );

  console.log("Seeding ShippingInfo...");
  await seedModel(
    path.join(seedDataPath, "shippingInfo.json"),
    prisma.shippingInfo
  );

  console.log("Seeding BillingInfo...");
  await seedModel(
    path.join(seedDataPath, "billingInfo.json"),
    prisma.billingInfo
  );

  console.log("Seeding Variants...");
  await seedModel(path.join(seedDataPath, "variants.json"), prisma.variants);

  console.log("Seeding ProductVariants...");
  await seedModel(
    path.join(seedDataPath, "productVariants.json"),
    prisma.productVariants
  );

  console.log("Seeding Reviews...");
  await seedModel(path.join(seedDataPath, "reviews.json"), prisma.reviews);

  console.log("Seeding Orders...");
  await seedModel(path.join(seedDataPath, "orders.json"), prisma.orders);

  console.log("Seeding OrderItems...");
  await seedModel(
    path.join(seedDataPath, "orderItems.json"),
    prisma.orderItems
  );

  console.log("Seeding Carts...");
  await seedModel(path.join(seedDataPath, "carts.json"), prisma.carts);

  console.log("Seeding CartItems...");
  await seedModel(path.join(seedDataPath, "cartItems.json"), prisma.cartItems);
}

// Run the main function
main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
