import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "cartItems.json",
    "orderItems.json",
    "productCategories.json",
    "carts.json",
    "orders.json", // Delete Orders first
    "shippingInfo.json", // Delete ShippingInfo after Orders
    "billingInfo.json", // Delete BillingInfo after Orders
    "productVariants.json",
    "categories.json",
    "variants.json",
    "reviews.json",
    "products.json",
    "users.json",
  ];

  const orderedFileNamesSeed = [
    "users.json",
    "categories.json",
    "variants.json",
    "products.json",
    "productVariants.json",
    "reviews.json",
    "shippingInfo.json", // Added
    "billingInfo.json", // Added
    "orders.json",
    "carts.json",
    "productCategories.json",
    "orderItems.json",
    "cartItems.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNamesSeed) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }
    // Check the variantIds for debuggin
    if (modelName === "productVariants") {
      console.log(
        "Seeding ProductVariants with the following variantIds:",
        jsonData.map((v: any) => v.variantId)
      );
    }

    for (const data of jsonData) {
      if (modelName === "orderItems") {
        // Check if the orderId exists in Orders before creating OrderItems
        const orderExists = await prisma.orders.findUnique({
          where: { orderId: data.orderId },
        });
        if (!orderExists) {
          console.error(
            `Order with orderId ${data.orderId} not found. Skipping this OrderItem.`
          );
          continue;
        }
      }
      if (modelName === "productVariants") {
        for (const variant of jsonData) {
          const variantExists = await prisma.variants.findUnique({
            where: { variantId: variant.variantId },
          });
          if (!variantExists) {
            console.error(
              `Variant with variantId ${variant.variantId} not found. Skipping this ProductVariant.`
            );
            continue;
          }
        }
      }
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

// Run the main function and handle errors
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
