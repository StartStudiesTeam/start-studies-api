-- CreateTable
CREATE TABLE "roadmaps" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roadmaps_user_id_idx" ON "roadmaps"("user_id");

-- CreateIndex
CREATE INDEX "roadmaps_status_idx" ON "roadmaps"("status");

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
