/*
  Warnings:

  - You are about to drop the column `category` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoriesSubcategoryId` on the `Products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_subCategoriesSubcategoryId_fkey";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "category",
DROP COLUMN "subCategoriesSubcategoryId";

-- CreateTable
CREATE TABLE "ProductSubCategories" (
    "productId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "ProductSubCategories_pkey" PRIMARY KEY ("productId","subcategoryId")
);

-- AddForeignKey
ALTER TABLE "ProductSubCategories" ADD CONSTRAINT "ProductSubCategories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategories" ADD CONSTRAINT "ProductSubCategories_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategories"("subcategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
