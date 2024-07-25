/*
  Warnings:

  - Made the column `organizationId` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `creatorId` to the `userInvites` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('CLOSED', 'OPEN', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_organizationId_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "userInvites" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'OPEN';

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userInvites" ADD CONSTRAINT "userInvites_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
