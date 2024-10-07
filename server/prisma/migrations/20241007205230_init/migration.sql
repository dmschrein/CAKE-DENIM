/*
  Warnings:

  - You are about to drop the column `colorId` on the `Variants` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Variants` table. All the data in the column will be lost.
  - You are about to drop the `Colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sizes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `Variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Variants" DROP CONSTRAINT "Variants_colorId_fkey";

-- DropForeignKey
ALTER TABLE "Variants" DROP CONSTRAINT "Variants_sizeId_fkey";

-- AlterTable
ALTER TABLE "Variants" DROP COLUMN "colorId",
DROP COLUMN "sizeId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- DropTable
DROP TABLE "Colors";

-- DropTable
DROP TABLE "Sizes";
