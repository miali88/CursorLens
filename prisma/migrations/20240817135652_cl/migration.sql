/*
  Warnings:

  - You are about to drop the column `configurationId` on the `Log` table. All the data in the column will be lost.
  - Made the column `metadata` on table `Log` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_configurationId_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "configurationId",
ALTER COLUMN "metadata" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");
