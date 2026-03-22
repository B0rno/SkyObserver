/*
  Warnings:

  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ListToObservation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "List" DROP CONSTRAINT "List_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ListToObservation" DROP CONSTRAINT "_ListToObservation_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListToObservation" DROP CONSTRAINT "_ListToObservation_B_fkey";

-- DropTable
DROP TABLE "List";

-- DropTable
DROP TABLE "_ListToObservation";
