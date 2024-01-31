/*
  Warnings:

  - You are about to alter the column `name` on the `pestsanddeseases` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[name]` on the table `PestsAndDeseases` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pestsanddeseases` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usersdiagnosehistory` MODIFY `pestAndDeseaseCode` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PestsAndDeseases_name_key` ON `PestsAndDeseases`(`name`);
