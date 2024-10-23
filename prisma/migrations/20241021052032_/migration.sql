/*
  Warnings:

  - Added the required column `method` to the `RowData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RowData" ADD COLUMN     "method" TEXT NOT NULL;
