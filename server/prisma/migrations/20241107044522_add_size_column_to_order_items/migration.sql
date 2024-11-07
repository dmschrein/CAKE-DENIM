/*
  Warnings:

  - Added the required column `color` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
