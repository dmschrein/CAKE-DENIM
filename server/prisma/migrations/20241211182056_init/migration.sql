/*
  Warnings:

  - Added the required column `categoryName` to the `SubCategories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubCategories" ADD COLUMN     "categoryName" TEXT NOT NULL;
