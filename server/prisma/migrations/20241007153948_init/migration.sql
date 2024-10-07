/*
  Warnings:

  - The primary key for the `ProductVariants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `colorId` on the `ProductVariants` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ProductVariants` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `ProductVariants` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `ProductVariants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_variantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_colorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_sizeId_fkey";

-- AlterTable
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_pkey",
DROP COLUMN "colorId",
DROP COLUMN "price",
DROP COLUMN "sizeId",
DROP COLUMN "stockQuantity",
ADD COLUMN     "colorsColorId" TEXT,
ADD COLUMN     "sizesSizeId" TEXT,
ADD CONSTRAINT "ProductVariants_pkey" PRIMARY KEY ("variantId", "productId");

-- CreateTable
CREATE TABLE "Variants" (
    "variantId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "productsProductId" TEXT,

    CONSTRAINT "Variants_pkey" PRIMARY KEY ("variantId")
);

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Sizes"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_productsProductId_fkey" FOREIGN KEY ("productsProductId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variants"("variantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_sizesSizeId_fkey" FOREIGN KEY ("sizesSizeId") REFERENCES "Sizes"("sizeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_colorsColorId_fkey" FOREIGN KEY ("colorsColorId") REFERENCES "Colors"("colorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variants"("variantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variants"("variantId") ON DELETE RESTRICT ON UPDATE CASCADE;
