-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('CLIENT', 'PROSPECT', 'INACTIF');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'PROSPECT',
ADD COLUMN     "title" TEXT;
