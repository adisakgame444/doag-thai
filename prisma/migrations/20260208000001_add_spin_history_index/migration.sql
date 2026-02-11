-- CreateIndex
CREATE INDEX "spin_history_userId_createdAt_idx" ON "spin_history"("userId", "createdAt" DESC);
