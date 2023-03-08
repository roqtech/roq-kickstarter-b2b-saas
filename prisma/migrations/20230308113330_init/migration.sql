/*
  Warnings:

  - You are about to drop the column `roqUserId` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `roqUserId` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "roqUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "roqUserId";
