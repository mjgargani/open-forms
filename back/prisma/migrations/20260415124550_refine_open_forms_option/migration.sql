/*
  Warnings:

  - You are about to drop the column `text` on the `Option` table. All the data in the column will be lost.
  - Added the required column `description` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'UNIQUE';

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "text",
ADD COLUMN     "correct" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "type" "QuestionType" NOT NULL;
