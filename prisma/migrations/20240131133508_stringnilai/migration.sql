/*
  Warnings:

  - You are about to alter the column `nilaiipa` on the `daftarsiswa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `nilaiips` on the `daftarsiswa` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `daftarsiswa` MODIFY `nilaiipa` VARCHAR(191) NOT NULL DEFAULT '0',
    MODIFY `nilaiips` VARCHAR(191) NOT NULL DEFAULT '0';
