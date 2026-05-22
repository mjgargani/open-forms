-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "user" VARCHAR(300) NOT NULL,
    "email" VARCHAR(300) NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "password" VARCHAR(300) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_key" ON "User"("user");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
