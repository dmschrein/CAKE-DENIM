/*
  Warnings:

  - You are about to drop the column `productsProductId` on the `Variants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variants" DROP CONSTRAINT "Variants_productsProductId_fkey";

-- AlterTable
ALTER TABLE "Variants" DROP COLUMN "productsProductId";
