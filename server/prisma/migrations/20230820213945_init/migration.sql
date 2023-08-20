-- CreateTable
CREATE TABLE `User` (
    `UserId` INTEGER NOT NULL AUTO_INCREMENT,
    `FullName` VARCHAR(191) NULL,
    `Identification` VARCHAR(191) NOT NULL,
    `PhoneNumber` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `Proveedor` VARCHAR(191) NULL,
    `IsActive` BOOLEAN NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `VerificationCode` VARCHAR(191) NOT NULL,
    `VerificationToken` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_Email_key`(`Email`),
    PRIMARY KEY (`UserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `RoleId` INTEGER NOT NULL,
    `RoleName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`RoleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `RoleId` INTEGER NOT NULL,

    UNIQUE INDEX `UserRole_UserId_RoleId_key`(`UserId`, `RoleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `PaymentMethodId` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `PaymentType` VARCHAR(191) NOT NULL,
    `Provider` VARCHAR(191) NULL,
    `AccountNumber` VARCHAR(191) NOT NULL,
    `ExpirationMonth` VARCHAR(191) NOT NULL,
    `ExpirationYear` VARCHAR(191) NOT NULL,
    `Cvc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`PaymentMethodId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `AddressId` INTEGER NOT NULL AUTO_INCREMENT,
    `Province` VARCHAR(191) NOT NULL,
    `Canton` VARCHAR(191) NOT NULL,
    `District` VARCHAR(191) NOT NULL,
    `ExactAddress` VARCHAR(191) NOT NULL,
    `PostalCode` VARCHAR(191) NOT NULL,
    `Phone` VARCHAR(191) NOT NULL,
    `UserId` INTEGER NOT NULL,

    PRIMARY KEY (`AddressId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `CategoryId` INTEGER NOT NULL,
    `CategoryName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`CategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `ProductId` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductName` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `Price` DOUBLE NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `CategoryId` INTEGER NOT NULL,
    `UserId` INTEGER NOT NULL,
    `Status` VARCHAR(191) NOT NULL,
    `Rating` INTEGER NOT NULL,

    PRIMARY KEY (`ProductId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
    `PhotoId` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductId` INTEGER NOT NULL,
    `PhotoURL` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`PhotoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `QuestionId` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductId` INTEGER NOT NULL,
    `UserId` INTEGER NOT NULL,
    `QuestionText` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`QuestionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `AnswerId` INTEGER NOT NULL AUTO_INCREMENT,
    `QuestionId` INTEGER NOT NULL,
    `UserId` INTEGER NOT NULL,
    `AnswerText` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`AnswerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `PurchaseId` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `PaymentMethodId` INTEGER NOT NULL,
    `AddressId` INTEGER NOT NULL,
    `ProductId` INTEGER NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `TotalAmount` DOUBLE NOT NULL,
    `TaxAmount` DOUBLE NOT NULL,
    `PurchaseDate` DATETIME(3) NOT NULL,
    `PurchaseStatus` VARCHAR(191) NOT NULL,
    `Subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`PurchaseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseItem` (
    `PurchaseItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `PurchaseId` INTEGER NOT NULL,
    `ProductId` INTEGER NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Subtotal` DOUBLE NOT NULL,
    `PurchaseStatus` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`PurchaseItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation` (
    `EvaluationId` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `Rating` INTEGER NOT NULL,
    `Comment` VARCHAR(191) NOT NULL,
    `PurchaseId` INTEGER NOT NULL,

    PRIMARY KEY (`EvaluationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_RoleId_fkey` FOREIGN KEY (`RoleId`) REFERENCES `Role`(`RoleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_CategoryId_fkey` FOREIGN KEY (`CategoryId`) REFERENCES `Category`(`CategoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Photo` ADD CONSTRAINT `Photo_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`ProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`ProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_QuestionId_fkey` FOREIGN KEY (`QuestionId`) REFERENCES `Question`(`QuestionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_AddressId_fkey` FOREIGN KEY (`AddressId`) REFERENCES `Address`(`AddressId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_PaymentMethodId_fkey` FOREIGN KEY (`PaymentMethodId`) REFERENCES `PaymentMethod`(`PaymentMethodId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`ProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_PurchaseId_fkey` FOREIGN KEY (`PurchaseId`) REFERENCES `Purchase`(`PurchaseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Product`(`ProductId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`UserId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_PurchaseId_fkey` FOREIGN KEY (`PurchaseId`) REFERENCES `Purchase`(`PurchaseId`) ON DELETE RESTRICT ON UPDATE CASCADE;
