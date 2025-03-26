/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `BehindImage` table. All the data in the column will be lost.
  - Added the required column `customId` to the `BehindImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileKey` to the `BehindImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `BehindImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BehindImage" DROP COLUMN "imageUrl",
ADD COLUMN     "customId" TEXT NOT NULL,
ADD COLUMN     "fileKey" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
