/*
  Warnings:

  - You are about to drop the column `createdAt` on the `daftarsiswa` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `daftarsiswa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `daftarsiswa` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
