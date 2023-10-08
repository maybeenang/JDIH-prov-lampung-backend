/*
  Warnings:

  - Added the required column `tanggal` to the `Berita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Berita` ADD COLUMN `tanggal` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Aricle` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL DEFAULT 'https://picsum.photos/200/300',
    `abstarct` VARCHAR(191) NOT NULL,
    `penerbit` VARCHAR(191) NOT NULL,
    `pengarang` VARCHAR(191) NOT NULL,
    `tahun` VARCHAR(191) NOT NULL,
    `isbn` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,
    `tanggal` VARCHAR(191) NOT NULL,
    `dilihat` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
