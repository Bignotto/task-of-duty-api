-- CreateTable
CREATE TABLE "userInvites" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "userInvites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userInvites_userId_key" ON "userInvites"("userId");

-- AddForeignKey
ALTER TABLE "userInvites" ADD CONSTRAINT "userInvites_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userInvites" ADD CONSTRAINT "userInvites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
