/*
  Warnings:

  - You are about to drop the column `userId` on the `Berita` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Berita` DROP FOREIGN KEY `Berita_userId_fkey`;

-- AlterTable
ALTER TABLE `Berita` DROP COLUMN `userId`;
