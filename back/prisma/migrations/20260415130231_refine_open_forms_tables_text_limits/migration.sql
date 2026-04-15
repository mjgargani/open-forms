/*
  Warnings:

  - You are about to alter the column `title` on the `Form` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(280)`.
  - You are about to alter the column `description` on the `Form` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(280)`.
  - You are about to alter the column `description` on the `Option` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(280)`.
  - You are about to alter the column `title` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(280)`.

*/
-- AlterTable
ALTER TABLE "Form" ALTER COLUMN "title" SET DATA TYPE VARCHAR(280),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(280);

-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "description" SET DATA TYPE VARCHAR(280);

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "title" SET DATA TYPE VARCHAR(280);
