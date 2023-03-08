/*
  Warnings:

  - Added the required column `roqUserId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "roqUserId" TEXT NOT NULL;
