/*
  Warnings:

  - You are about to drop the column `created_at` on the `RowData` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `RowData` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RowData` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `RowData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RowData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RowData" DROP CONSTRAINT "RowData_userId_fkey";

-- AlterTable
ALTER TABLE "RowData" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projectId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProject" (
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- AddForeignKey
ALTER TABLE "RowData" ADD CONSTRAINT "RowData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
