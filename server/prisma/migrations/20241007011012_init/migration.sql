/*
  Warnings:

  - You are about to drop the column `productId` on the `Categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_productId_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "ProductCategories" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategories_pkey" PRIMARY KEY ("productId","categoryId")
);

-- AddForeignKey
ALTER TABLE "ProductCategories" ADD CONSTRAINT "ProductCategories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategories" ADD CONSTRAINT "ProductCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
