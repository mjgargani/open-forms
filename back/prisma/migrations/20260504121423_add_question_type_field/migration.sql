-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('DISCURSIVE', 'SINGLE', 'MULTIPLE');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'MULTIPLE';
