/*
  Warnings:

  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_variantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_colorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_sizeId_fkey";

-- DropTable
DROP TABLE "ProductVariant";

-- CreateTable
CREATE TABLE "ProductVariants" (
    "variantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stockQuantity" INTEGER NOT NULL,

    CONSTRAINT "ProductVariants_pkey" PRIMARY KEY ("variantId")
);

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariants"("variantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariants"("variantId") ON DELETE RESTRICT ON UPDATE CASCADE;
