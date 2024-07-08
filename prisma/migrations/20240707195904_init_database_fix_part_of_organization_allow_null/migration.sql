-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_partOfOrganizationId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "partOfOrganizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_partOfOrganizationId_fkey" FOREIGN KEY ("partOfOrganizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
