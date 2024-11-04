-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('FREE_STANDARD', 'GROUND', 'EXPRESS', 'NEXT_DAY');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CREDIT_CARD', 'PAYPAL', 'AFTERPAY');

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL DEFAULT 'FREE_STANDARD',
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "addressId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "PaymentInfo" (
    "paymentId" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL DEFAULT 'CREDIT_CARD',

    CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("paymentId")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "PaymentInfo"("paymentId") ON DELETE SET NULL ON UPDATE CASCADE;
