-- CreateTable
CREATE TABLE "RecommendationSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientSnapshotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationSnapshot_userId_clientSnapshotId_key" ON "RecommendationSnapshot"("userId", "clientSnapshotId");

-- CreateIndex
CREATE INDEX "RecommendationSnapshot_userId_idx" ON "RecommendationSnapshot"("userId");

-- CreateIndex
CREATE INDEX "RecommendationSnapshot_createdAt_idx" ON "RecommendationSnapshot"("createdAt");

-- AddForeignKey
ALTER TABLE "RecommendationSnapshot" ADD CONSTRAINT "RecommendationSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
