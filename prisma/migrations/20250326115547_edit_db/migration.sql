/*
  Warnings:

  - You are about to drop the column `storeId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_storeId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "storeId",
ADD COLUMN     "lastReset" TIMESTAMP(3),
ADD COLUMN     "subscriptionCode" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT;
