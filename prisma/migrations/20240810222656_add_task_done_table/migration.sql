-- CreateTable
CREATE TABLE "TaskDone" (
    "id" BIGSERIAL NOT NULL,
    "comment" TEXT,
    "doneDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "taskId" BIGINT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "TaskDone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskDone" ADD CONSTRAINT "TaskDone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDone" ADD CONSTRAINT "TaskDone_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDone" ADD CONSTRAINT "TaskDone_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
