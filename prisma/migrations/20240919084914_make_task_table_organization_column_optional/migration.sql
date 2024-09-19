-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_organizationId_fkey";

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
