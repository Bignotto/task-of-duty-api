-- CreateTable
CREATE TABLE "_TaskListToUser" (
    "A" BIGINT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaskListToUser_AB_unique" ON "_TaskListToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskListToUser_B_index" ON "_TaskListToUser"("B");

-- AddForeignKey
ALTER TABLE "_TaskListToUser" ADD CONSTRAINT "_TaskListToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "taskLists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskListToUser" ADD CONSTRAINT "_TaskListToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
