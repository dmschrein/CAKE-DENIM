/*
  Warnings:

  - You are about to drop the column `colorsColorId` on the `ProductVariants` table. All the data in the column will be lost.
  - You are about to drop the column `sizesSizeId` on the `ProductVariants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_colorsColorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_sizesSizeId_fkey";

-- AlterTable
ALTER TABLE "ProductVariants" DROP COLUMN "colorsColorId",
DROP COLUMN "sizesSizeId";
