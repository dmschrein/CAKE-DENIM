-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "subCategoriesSubcategoryId" TEXT;

-- CreateTable
CREATE TABLE "SubCategories" (
    "subcategoryId" TEXT NOT NULL,
    "subcategoryName" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategories_pkey" PRIMARY KEY ("subcategoryId")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_subCategoriesSubcategoryId_fkey" FOREIGN KEY ("subCategoriesSubcategoryId") REFERENCES "SubCategories"("subcategoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategories" ADD CONSTRAINT "SubCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
