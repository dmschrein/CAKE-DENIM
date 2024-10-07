/*
  Warnings:

  - You are about to drop the column `productId` on the `CartItems` table. All the data in the column will be lost.
  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Size` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_colorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_sizeId_fkey";

-- AlterTable
ALTER TABLE "CartItems" DROP COLUMN "productId";

-- DropTable
DROP TABLE "Color";

-- DropTable
DROP TABLE "Size";

-- CreateTable
CREATE TABLE "Sizes" (
    "sizeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sizes_pkey" PRIMARY KEY ("sizeId")
);

-- CreateTable
CREATE TABLE "Colors" (
    "colorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Colors_pkey" PRIMARY KEY ("colorId")
);

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Sizes"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;
