/*
  Warnings:

  - The values [OPT_IN_ONLY] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('EMAIL_ONLY', 'GUEST', 'REGISTERED');
ALTER TABLE "Users" ALTER COLUMN "userType" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "userType" TYPE "UserType_new" USING ("userType"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
ALTER TABLE "Users" ALTER COLUMN "userType" SET DEFAULT 'REGISTERED';
COMMIT;
