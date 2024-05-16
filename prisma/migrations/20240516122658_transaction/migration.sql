-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "qris_string" DROP NOT NULL,
ALTER COLUMN "total_accepted" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'UNPAID';
