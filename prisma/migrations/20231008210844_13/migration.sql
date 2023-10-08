/*
  Warnings:

  - You are about to drop the column `abstarct` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `dilihat` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `isbn` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `penerbit` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `pengarang` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `tahun` on the `Monografi` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `Monografi` table. All the data in the column will be lost.
  - Added the required column `url` to the `Monografi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Monografi` DROP COLUMN `abstarct`,
    DROP COLUMN `content`,
    DROP COLUMN `dilihat`,
    DROP COLUMN `isbn`,
    DROP COLUMN `keterangan`,
    DROP COLUMN `penerbit`,
    DROP COLUMN `pengarang`,
    DROP COLUMN `tahun`,
    DROP COLUMN `tanggal`,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
