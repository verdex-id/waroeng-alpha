/*
  Warnings:

  - You are about to drop the column `chasier_username` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Chasier` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cashier_username` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_chasier_username_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "chasier_username",
ADD COLUMN     "cashier_username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Chasier";

-- CreateTable
CREATE TABLE "Cashier" (
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("username")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cashier_username_fkey" FOREIGN KEY ("cashier_username") REFERENCES "Cashier"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
