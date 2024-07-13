/*
  Warnings:

  - You are about to drop the column `userId` on the `userInvites` table. All the data in the column will be lost.
  - Added the required column `invitedPhone` to the `userInvites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userInvites" DROP CONSTRAINT "userInvites_userId_fkey";

-- DropIndex
DROP INDEX "userInvites_userId_key";

-- AlterTable
ALTER TABLE "userInvites" DROP COLUMN "userId",
ADD COLUMN     "invitedEmail" TEXT,
ADD COLUMN     "invitedPhone" TEXT NOT NULL;
