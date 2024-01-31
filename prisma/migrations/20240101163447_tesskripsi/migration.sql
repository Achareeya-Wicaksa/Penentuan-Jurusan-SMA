-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `fullname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifyToken` VARCHAR(191) NULL,
    `authToken` VARCHAR(191) NULL,
    `passwordResetToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_verifyToken_key`(`verifyToken`),
    UNIQUE INDEX `User_authToken_key`(`authToken`),
    UNIQUE INDEX `User_passwordResetToken_key`(`passwordResetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PestsAndDeseases` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `solution` TEXT NOT NULL,
    `activeIngredient` TEXT NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Symptoms` (
    `code` INTEGER NOT NULL AUTO_INCREMENT,
    `info` VARCHAR(255) NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PestsAndDeseasesHasSymptoms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pestAndDeseaseCode` INTEGER NOT NULL,
    `symptomCode` INTEGER NOT NULL,
    `expertCF` DOUBLE NOT NULL DEFAULT 0,

    INDEX `PestsAndDeseasesHasSymptoms_symptomCode_idx`(`symptomCode`),
    INDEX `PestsAndDeseasesHasSymptoms_pestAndDeseaseCode_idx`(`pestAndDeseaseCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsersDiagnoseHistory` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nimSiswa` INTEGER NOT NULL,
    `pestAndDeseaseCode` INTEGER NOT NULL,
    `finalCF` DOUBLE NOT NULL DEFAULT 0,
    `userInputData` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UsersDiagnoseHistory_userId_idx`(`userId`),
    INDEX `UsersDiagnoseHistory_pestAndDeseaseCode_idx`(`pestAndDeseaseCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DaftarSiswa` (
    `id` VARCHAR(191) NOT NULL,
    `nim` INTEGER NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DaftarSiswa_nim_key`(`nim`),
    UNIQUE INDEX `DaftarSiswa_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PestsAndDeseasesHasSymptoms` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PestsAndDeseasesHasSymptoms_AB_unique`(`A`, `B`),
    INDEX `_PestsAndDeseasesHasSymptoms_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
