/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Selection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item]` on the table `Selection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Selection" DROP COLUMN "createdAt";

-- CreateIndex
CREATE UNIQUE INDEX "Selection_item_key" ON "Selection"("item");
