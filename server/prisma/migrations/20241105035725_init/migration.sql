/*
  Warnings:

  - You are about to drop the column `deliveryType` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `billingInfoId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingInfoId` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "deliveryType",
ADD COLUMN     "billingInfoId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "shippingInfoId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ShippingInfo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "deliveryMethod" "DeliveryType" NOT NULL DEFAULT 'FREE_STANDARD',

    CONSTRAINT "ShippingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingInfo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "mobilePhone" TEXT,

    CONSTRAINT "BillingInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_shippingInfoId_fkey" FOREIGN KEY ("shippingInfoId") REFERENCES "ShippingInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_billingInfoId_fkey" FOREIGN KEY ("billingInfoId") REFERENCES "BillingInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
