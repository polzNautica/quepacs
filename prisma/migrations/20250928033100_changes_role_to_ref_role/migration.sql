/*
  Warnings:

  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_ibfk_2`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `user_role`;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
